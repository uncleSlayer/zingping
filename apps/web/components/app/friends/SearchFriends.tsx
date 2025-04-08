
import { Card } from "@/components/ui/card";
import SearchForm from "./SearchForm";

const SearchFriends = () => {
    return (
        <Card className="min-h-[150px] shadow-lg my-5 px-10 py-2 md:flex md:flex-col md:items-center md:justify-center">
            <h3 className="font-medium my-2">Search for a friend</h3>
            <SearchForm />
        </Card>
    )
}

export default SearchFriends