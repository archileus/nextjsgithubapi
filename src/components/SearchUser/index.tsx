
import { ChangeEvent, KeyboardEvent, useReducer, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, Alert, Button, Card, Input, Spinner, Typography } from '@material-tailwind/react'
import ArrowIcon from '@/components/ArrowIcon';
import { Types, stateReducer } from './reducers';
import useSearchingUser from './hooks/useSearchingUser';
import useSearchingRepo from './hooks/useSearchingRepo';

const initialState: StateType = {
    isAccordionOpen: 0,
    inputErrorMessage: "",
    usernameValue: "",
    noUserFoundMsg: "",
    noUserRepoFoundMsg: "",
    userList: []
}

const MIN_SEARCH_CHAR = 2;
const SearchUser = () => {
    const [state, dispatch] = useReducer(stateReducer, initialState);
    const {
        isAccordionOpen,
        inputErrorMessage,
        usernameValue,
        noUserFoundMsg,
        noUserRepoFoundMsg,
        userList
    } = state;

    const { isLoading: isSearchUserLoading, fetchSearchUser } = useSearchingUser();
    const { isLoading: isSearchRepoLoading, fetchSearchRepo } = useSearchingRepo();



    const handleOpenRepo = async (userId: number, reposUrl: string, hasReposList: boolean) => {
        dispatch({ type: Types.SET_STATE, payload: { isAccordionOpen: (isAccordionOpen === userId) ? 0 : userId } })

        if (!reposUrl) return;

        if (!hasReposList) {
            const { data, isError } = await fetchSearchRepo({ reposUrl });

            if (isError) {
                dispatch({ type: Types.SET_STATE, payload: { noUserRepoFoundMsg: "Error Search Repo" } })
            }

            if (!data || data.length === 0) {
                dispatch({ type: Types.SET_STATE, payload: { noUserRepoFoundMsg: 'No Repo Found' } })
                return;
            }
            dispatch({ type: Types.SET_STATE, payload: { noUserRepoFoundMsg: '' } });

            const userRepoList = data.map(repoData => {
                const { id, html_url, name, description } = repoData;

                return {
                    id,
                    url: html_url,
                    title: name,
                    description
                }
            })

            const newUserList = userList.map(user => {
                const { id } = user;
                if (userId === id) {
                    return { ...user, reposList: userRepoList }
                }
                return user;
            })
            dispatch({ type: Types.SET_STATE, payload: { userList: newUserList } });

        }


    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: Types.SET_STATE, payload: { usernameValue: e.currentTarget.value } })
    }
    const handleSearchUsername = async () => {

        if (usernameValue.length >= MIN_SEARCH_CHAR) {
            dispatch({ type: Types.SET_STATE, payload: { inputErrorMessage: '' } })

            const { data, isError } = await fetchSearchUser({ usernameValue });

            if (isError) {
                dispatch({ type: Types.SET_STATE, payload: { noUserFoundMsg: "Error Searching User" } })
                return
            }
            const items = data?.items || [];

            if (items.length === 0) {
                dispatch({ type: Types.SET_STATE, payload: { noUserFoundMsg: 'No User Found' } })

                return;
            }
            dispatch({ type: Types.SET_STATE, payload: { noUserFoundMsg: '' } })
            const userDataList = items.map(item => {
                const { id, login, repos_url } = item;

                return {
                    id,
                    name: login,
                    reposUrl: repos_url
                } as UserData
            })

            dispatch({ type: Types.SET_STATE, payload: { userList: userDataList } });

        } else {
            dispatch({ type: Types.SET_STATE, payload: { inputErrorMessage: `Please enter ${MIN_SEARCH_CHAR} or more characters` } })

        }

    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchUsername();
        }
    }

    const renderUserRepoItem = (reposList: RepoData[]) => {
        if (noUserRepoFoundMsg) {
            return <Alert color="red"> {noUserRepoFoundMsg}</Alert>
        }
        return reposList.map(item => {
            const { id, title = '', description = '', url } = item;

            return (
                <a target='_blank' href={url} key={id}>
                    <Card className='p-4 mb-4 ml-4 mr-1'>
                        <Typography variant="h5">
                            {title}
                        </Typography>
                        <Typography variant="paragraph">
                            {description}
                        </Typography>
                    </Card>
                </a>
            )
        })
    }
    const renderSearchUser = () => {
        if (noUserFoundMsg) {
            return <Alert color="red"> {noUserFoundMsg}</Alert>
        }
        if (userList.length === 0) return;


        return userList.map(userData => {
            const { id, name, reposUrl, reposList = [] } = userData;
            const hasReposList = reposList.length > 0;
            return (
                <Accordion key={id} open={isAccordionOpen === id} icon={<ArrowIcon id={id} open={isAccordionOpen} />}>
                    <AccordionHeader onClick={() => handleOpenRepo(id, reposUrl, hasReposList)}>
                        {name}
                    </AccordionHeader>
                    <AccordionBody>
                        {isSearchRepoLoading ? <Spinner /> : renderUserRepoItem(reposList)}
                    </AccordionBody>
                </Accordion>
            )
        });

    }
    return (
        <Card className="p-4">
            <div className="flex flex-col gap-4">
                <Input error={Boolean(inputErrorMessage)} aria-label="input-search" label="Enter username" value={usernameValue} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                {Boolean(inputErrorMessage) && <Alert className="text-xs p-2" color="red">{inputErrorMessage}</Alert>}
                <Button aria-label="button-search" onClick={handleSearchUsername}>Search</Button>

                {isSearchUserLoading ? <Spinner /> : renderSearchUser()}

            </div>
        </Card>
    )
}

export default SearchUser;