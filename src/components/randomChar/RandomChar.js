import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


class RandomChar extends Component {
    state = {
        char: {},
        loading: true, //true -персонаж загружается, запускается spinner, когда загрузился - loading: false 
        error : false
    }

    marvelService = new MarvelService();

    componentDidMount() { //ВЫЗЫВАЕМ ЭТУ ФУНКЦИЮ ПОСЛЕ ЗАГРУЗКИ КОМПОНЕНТА
        this.updateChar();
    }

    onCharLoaded = (char) => { //загружаем персонажа
        if (!char.description) {
            char.description = 'Description is none';
        } else if (char.description.length > 200) {
            char.description = char.description.slice(0, 200) + '...'
        }
        this.setState({char, loading: false})//char: char 
    }

    onCharLoading = () => { //Включаем spinner при обновлении персонажа
        this.setState({loading: true})
    }

    onError = () => { //сообщение об ошибке ( если такого персонажа нет)
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //выбираем случаный id персонажа
        this.onCharLoading(); //вызываем spinner, пока персонаж загружается
        this.marvelService
            .getCharacter(id) //вызываем getCharacter из MarvelService передавая id 
            .then(this.onCharLoaded) //когда персонаж получен загружаем его в state вызывая onCharLoaded
            .catch(this.onError) // вызываем onError , если получаем ошибку( такого персонажа нет)
    }

    render() {
        const {char, loading, error} = this.state; //вытаскиваем нужные данные из state
        const errorMessage = error ? <ErrorMessage /> : null; 
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div onClick={this.updateChar} className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
}

export default RandomChar;