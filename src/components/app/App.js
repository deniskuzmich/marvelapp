import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../404/404'));   
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComic = lazy(() => import('../singleComic/SingleComic'));



//В comicId ПРИХОДИТ ID ПЕРСОНАЖА, НА КОТОРОГО МЫ НАЖАЛИ
const App = () => {
        return (
            <Router>
                <div className="app">
                    <AppHeader/>
                    <main>
                        <Suspense fallback={<Spinner />}>
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route path="/comics" element={<ComicsPage />} />
                                <Route path="/comics/:comicId" element={<SingleComic />} /> 
                                <Route path="*" element={<Page404 />}/>
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        )
    }
export default App;


