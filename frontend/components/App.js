import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/');
 }
  const redirectToArticles = () => { 
    navigate('/articles');
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setSpinnerOn(true);
    localStorage.removeItem('token');
    redirectToLogin();
    setSpinnerOn(false);
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axios
      .post(loginUrl, {username:username,password:password})
      .then((resp) => { 
        setMessage(resp.data.message);
        localStorage.setItem('token', resp.data.token);
        redirectToArticles();    
        setSpinnerOn(false);

      })
      .catch((err) => {
        redirectToLogin();
        setSpinnerOn(false);
  }   );
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axios.get(articlesUrl, { headers: {"Authorization" : `${localStorage.getItem('token')}`} })
      .then((res) => {
        setMessage(res.data.message);
        setArticles(res.data.articles);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        redirectToLogin();
        setSpinnerOn(false);
      });
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    setMessage('');
    setSpinnerOn(true);
    axios.post(articlesUrl, article, {headers:{"Authorization": `${localStorage.getItem('token')}`}})
    .then((res) => {
      setMessage(res.data.message);
      getArticles();
      setSpinnerOn(false);
    })    
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    console.log(article_id);
    console.log(article);
    setMessage('');
    setSpinnerOn(true);
    axios.put(articlesUrl+'/'+article_id, article, {headers:{"Authorization": `${localStorage.getItem('token')}`}})
      .then((res) => {
        console.log(res);
        setMessage(res.data.message);
        getArticles();
      });
  }

  const deleteArticle = article_id => {
    // ✨ implement
    console.log(article_id);
    setMessage('');
    setSpinnerOn(true);
    axios.delete(articlesUrl + '/' + article_id.article_id, {headers:{"Authorization": `${localStorage.getItem('token')}`}})
      .then((res) => {
        console.log(res);
        setMessage(res.data.message);
        getArticles();
      });
  }

  const handleEditButton = (art) =>{


    console.log(art);
    setCurrentArticleId(art.article_id);
    let values={
      title:art.title,
      text: art.text,
      topic: art.topic
    };

    articles.map((article) => {
      if(article.article_id == art.articleId) {
        article.title=art.title;
        article.text=art.text;
        article.topic=art.topic;
      }
    });
    

  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm handleLogin={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
              postArticle={postArticle}
              updateArticle={updateArticle}
               setCurrentArticleId={setCurrentArticleId} 
               currentArticle={articles.filter((article) => article.article_id == currentArticleId)[0]}
              />
              <Articles articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle} 
              setCurrentArticleId={handleEditButton}
              currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
