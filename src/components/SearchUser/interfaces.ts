


interface RepoData {
    id: number,
    title: string,
    url: string,
    description?: string,
}
interface UserData {
    id: number,
    name: string,
    reposUrl: string,
    reposList?: RepoData[]
}

interface GitHubUserSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: {
        login: string;
        id: number;
        repos_url: string;
    }[];
}

interface GitHubUserRepoDataResponse {
    id: number,
    name: string,
    description: string,
    html_url: string,
}

interface StateType {
    isAccordionOpen: number,
    usernameValue: string,
    inputErrorMessage: string,
    noUserFoundMsg: string,
    noUserRepoFoundMsg: string,
    userList: UserData[]
}