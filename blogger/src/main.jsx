import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { Provider } from 'react-redux'
// import store from "./store/store.js"
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Home from './pages/Home.jsx'

// import AllPosts from './pages/AllPosts.jsx'
// import AddPost from './pages/AddPost.jsx'
// import EditPost from './pages/EditPost.jsx'
// import Signup from './pages/Signup.jsx'
// import {Login, Signup, Protected} from './components'


import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { Protected, Login } from './components/index.js'

import Post from "./pages/Post";
import AddPost from "./pages/AddPost";
import Signup from './pages/Signup'
// import Login from './pages/Login.jsx'
import EditPost from "./pages/EditPost";

// import Post from "./pages/Post";

import AllPosts from "./pages/AllPosts";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <Protected authentication={false}>
                    <Login />
                </Protected>
            ),
        },
        {
            path: "/signup",
            element: (
                <Protected authentication={false}>
                    <Signup/>
                </Protected>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <Protected authentication>
                    {" "}
                    <AllPosts />
                </Protected>
            ),
        },
        {
            path: "/add-post",
            element: (
                <Protected authentication>
                    {" "}
                    <AddPost />
                </Protected>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <Protected authentication>
                    {" "}
                    <EditPost />
                </Protected>
            ),
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
    ],
},
])
createRoot(document.getElementById('root')).render(
 <StrictMode>
    <Provider store = {store}>
     <RouterProvider router={router}/>
    </Provider>
    </StrictMode>
   
  
)
