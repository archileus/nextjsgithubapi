import { fireEvent, render, waitFor } from "@testing-library/react";
import Home from "../app/page";
import "@testing-library/jest-dom";
import useSearchingUser from "@/components/SearchUser/hooks/useSearchingUser";
import useSearchingRepo from "@/components/SearchUser/hooks/useSearchingRepo";


window.scrollTo = jest.fn();
jest.mock('../components/SearchUser/hooks/useSearchingUser', () => jest.fn());

jest.mock('../components/SearchUser/hooks/useSearchingRepo', () => jest.fn());

describe("Home", () => {
  beforeEach(() => {
    (useSearchingUser as jest.Mock).mockImplementation(() => {
      return {
        isLoading: false,
        fetchSearchUser: () => Promise.resolve({
          isError: false,
          data: {
            items: [{
              "login": "Arch",
              "id": 20105967,
              "repos_url": "https://api.github.com/users/Arch/repos",
            }, {
              "login": "archlinux",
              "id": 4673648,
              "repos_url": "https://api.github.com/users/archlinux/repos",
            }]
          }
        })
      }
    });

    (useSearchingRepo as jest.Mock).mockImplementation(() => {
      return {
        isLoading: false,
        fetchSearchRepo: () => Promise.resolve({
          isError: false,
          data: [
            {
              "id": 74559515,
              "name": "Alamofire",
              "html_url": "https://github.com/Arch/Alamofire",
              "description": "Elegant HTTP Networking in Swift",
            },
            {
              "id": 64044239,
              "name": "api-guidelines",
              "html_url": "https://github.com/Arch/api-guidelines",
              "description": "Microsoft REST API Guidelines",
            }
          ]
        })
      }
    })
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("Render page that has 3 search buttons", async () => {
    const { findAllByText } = render(<Home />);

    const search = await findAllByText(/search/i);
    expect(search).toHaveLength(3);
  });

  test("Input username must be more than 1 character when searching", async () => {
    const { findAllByLabelText, findByText } = render(<Home />);

    const inputList = await findAllByLabelText("input-search");
    const firstInput = inputList[0];
    fireEvent.change(firstInput, { target: { value: 'a' } });

    const buttonSearchList = await findAllByLabelText("button-search");
    const firstButtonSearch = buttonSearchList[0];

    fireEvent.click(firstButtonSearch);

    expect(await findByText(/Please enter 2 or more characters/i)).toBeInTheDocument();

  });

  test("Valid Search Username will render list of github user", async () => {


    const { findAllByLabelText, findByText, } = render(<Home />);

    const inputList = await findAllByLabelText("input-search");
    const firstInput = inputList[0];
    fireEvent.change(firstInput, { target: { value: 'arch' } });

    const buttonSearchList = await findAllByLabelText("button-search");
    const firstButtonSearch = buttonSearchList[0];

    fireEvent.click(firstButtonSearch);

    expect(await findByText("archlinux")).toBeInTheDocument();
  });

  test("Valid Search Username and click on the user will render list of user's repo", async () => {


    const { findAllByLabelText, findByText, } = render(<Home />);

    const inputList = await findAllByLabelText("input-search");
    const firstInput = inputList[0];
    fireEvent.change(firstInput, { target: { value: 'arch' } });

    const buttonSearchList = await findAllByLabelText("button-search");
    const firstButtonSearch = buttonSearchList[0];

    fireEvent.click(firstButtonSearch);

    const buttonUser = await findByText("Arch");
    fireEvent.click(buttonUser);
    expect(await findByText(/Elegant HTTP/i)).toBeInTheDocument();
  })
});
