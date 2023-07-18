import { useState } from "react";


const useSearchingRepo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const fetchSearchRepo = async ({ reposUrl }: { reposUrl: string }) => {
        const returnValue = {
            isError: false,
            data: [] as GitHubUserRepoDataResponse[]
        }
        setIsLoading(true);
        await fetch(reposUrl).then((response) => {
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

    return { isLoading, fetchSearchRepo };
}

export default useSearchingRepo;