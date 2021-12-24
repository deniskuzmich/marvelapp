import './charList.scss';

import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true); //первый раз вызываем onRequest без аргумента
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded) //сюда приходят данные и идут в newCharList
    }

    const onCharListLoaded = (newCharList) => { //данные в newCharList получаются из метода  выше 
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const refItems = useRef([]);

    const focusOnItem = (id) => { //перебираем элемент li который пришел сюда
        refItems.current.forEach(item => item.classList.remove('char__item_selected'));
        refItems.current[id].classList.add('char__item_selected');
        refItems.current[id].focus();
    }

    function renderItems(arr) { //ПЕРЕБОРКА МАССИВА С ПЕРСОНАЖАМИ
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item" 
                    key={item.id} 
                    tabIndex={0}
                    ref={el => refItems.current[i] = el} //делаем ссылку на этот элемент li 
                    //ПЕРЕДАЕМ id персонажа в onCharSelected в App
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i); //i - порядковый номер в массиве
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null; 
        const spinner = loading && !newItemLoading ? <Spinner /> : null;
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        ) 
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;