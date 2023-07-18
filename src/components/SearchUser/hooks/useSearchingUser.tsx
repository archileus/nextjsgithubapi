import { useState } from "react";

const useSearchingUser = () => {
    const [isLoading, setIsLoading] = useState(false);

    const fetchSearchUser = async ({ usernameValue }: { usernameValue: string }) => {
        const returnValue = {
            isError: false,
            data: {} as GitHubUserSearchResponse
        }
        setIsLoading(true);
        await fetch(`https://api.github.com/search/users?q=${usernameValue}&per_page=5`).then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Bad response from server")

        }).then((responseJson) => {
            returnValue.data = responseJson;
        }).catch(() => {
            returnValue.isError = true;
        }).finally(() => {
            setIsLoading(false);
        });

        return returnValue;
    }

    return { isLoading, fetchSearchUser };
}

export default useSearchingUser;