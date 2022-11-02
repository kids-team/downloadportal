import { createBrowserRouter } from "react-router-dom"
import ArticlePage from "../routes/ArticlePage"
import Bible from "../routes/Bible"
import SearchPage from "../routes/SearchPage"
import StartPage from "../routes/StartPage"
import Tag from "../routes/Tag"
//somehow we need to reintegrate the state
//const bibleurl = state.bible?.info?.url ?? "bible"


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
		element: <StartPage />,
		path: "/"
	},
	{
		element: <ArticlePage />,
		path: "*"
	}
])

export default router;