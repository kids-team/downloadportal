import { createBrowserRouter } from "react-router-dom"
import ArticlePage from "../routes/ArticlePage"
import Bible from "../routes/Bible"
import SearchPage from "../routes/SearchPage"
import Tag from "../routes/Tag"
import { store, getState } from "./store"
//somehow we need to reintegrate the state
//const bibleurl = state.bible?.info?.url ?? "bible"

const state = getState(store);


const router = createBrowserRouter([
	{
		element: <Bible />,
		path: "bible/:book/:chapter"
	},
	{
		element: <SearchPage />,
		path: "search/:query",
	},
	{
		element: <Tag />,
		path: "tag/:tag"
	},
	{
		element: <ArticlePage />,
		path: "*"
	}
])

export default router;