import { Component } from 'react';
import './charInfo.scss';

import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'

class CharInfo extends Component {

    state = {
        char: null,
        loading: false, //ИЗНАЧАЛЬНО FALSE , Т.К. ВКЛЮЧАТЬСЯ БУДЕТ СПИННЕР БУДЕТ ТОЛЬКО ПРИ ЗАПРОСЕ ПОЛЬЗОВАТЕЛЯ
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) { //ЕСЛИ ТЕКУЩИЙ charId не равен предыдущему charId
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props; //charId из App
        if (!charId) {
            return;
        }

        this.onCharLoading(); //показывает спиннер перед запросом
        this.marvelService
            .getCharacter(charId) 
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => { 
        this.setState({
            char, 
            loading: false
        }) 
    }
    
    onCharLoading = () => { 
        this.setState({
            loading: true
        })
    }
    
    onError = () => { 
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null; 
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char; 

    let imgStyle = {'objectFit' : 'cover'};
    if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'NO COMICS'}
                {
                    comics.map((item, i) => {
                        if (i >= 10) return; //Если списков больше или равно 10, отрисовка остальных останавливается
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;