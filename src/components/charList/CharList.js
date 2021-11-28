import './charList.scss';

import PropTypes from 'prop-types';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';


class CharList extends Component {
    state = {
        charList: [],
        loading: true, // при первом запуске появляется spinner
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest(); //первый раз вызываем onRequest без аргумента
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded) //сюда приходят данные и идут в newCharList
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => { //данные в newCharList получаются из метода  выше 
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }


        this.setState(({offset,charList}) => ({
            charList: [...charList, ...newCharList], //старый массив + новый
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => { //сообщение об ошибке ( если такого персонажа нет)
        this.setState({
            loading: false,
            error: true
        })
    }

    refItems = [];

    setRef = (ref) => { //сюда приходит элемент li
        this.refItems.push(ref); // элемент li пушится в refItems
    }

    focusOnItem = (id) => { //перебираем элемент li который пришел сюда
        this.refItems.forEach(item => item.classList.remove('char__item_selected'));
        this.refItems[id].classList.add('char__item_selected');
        this.refItems[id].focus();
    }

    renderItems(arr) { //ПЕРЕБОРКА МАССИВА С ПЕРСОНАЖАМИ
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
                    ref={this.setRef} //делаем ссылку на этот элемент li 
                    //ПЕРЕДАЕМ id персонажа в onCharSelected в App
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i); //i - порядковый номер в массиве
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null; 
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;