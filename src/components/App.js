import React from 'react';
import { Route, Switch } from 'react-router-dom';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import '../index.css';



function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);  

  React.useEffect(() => {
    api.getUserInfo()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(err => {
        console.log (`Ошибка: ${err}`)
      });
  }, []);

  React.useEffect(() => {
    api.getInitialCards()
      .then(res =>{
        setCards(res)
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
    });
  }, []);

  function handleAddPlace(name, link) {
    api.postNewCard(name, link)
     .then((res) => {
      setCards([res, ...cards]);
      closeAllPopups();
    })
    .catch(err => {
      console.log (`Ошибка: ${err}`)
    });
  }
  
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  };

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard(false)
  };

  const handleCardClick = (card) => {
    setIsImagePopupOpen(true);
    setSelectedCard(card)
  }

  React.useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    })
  },[]);

  function handelAddPlace(){
    setIsAddPlacePopupOpen(true)
  }

  function handleUpdateUser(name, about) {
    api.changeUserInfo(name, about)
    .then((user) => {
      setCurrentUser(user)
      closeAllPopups();
    })
    .catch(err => {
      console.log (`Ошибка: ${err}`)
    });
  }

  function handleUpdateAvatar(link) {
    api.updateAvatar(link)
    .then(user => {
      setCurrentUser(user);
      closeAllPopups();
    })
    .catch(err => {
      console.log (`Ошибка: ${err}`)
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
          const newCards = cards.map((c) => c._id === card._id ? newCard : c);
          setCards(newCards);
        })
        .catch(err => {
          console.log(`Ошибка: ${err}`)
    })
  }

  function handleCardDelete(cardId) {
    api.deleteCard(cardId)
      .then(() => {
        setCards(cards.filter((c) => c._id !== cardId));
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
    })
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header/>
        <Switch>
          <Main
            cards={cards}
            onEditProfile={handleEditProfileClick} 
            onEditAvatar={handleEditAvatarClick} 
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onAddPlace={handelAddPlace}
          />
          <Route path="/sing-up">
            
          </Route>
          <Route path="/sing-in">
           
          </Route>
          <Footer/>
        </Switch>
        <PopupWithForm name='delete' title='Вы уверены?' buttonText='Удалить' onClose={closeAllPopups}/>
        <ImagePopup 
          isOpen={isImagePopupOpen} 
          onClose={closeAllPopups} 
          card={selectedCard} 
          link={selectedCard.link} 
          name={selectedCard.name}
        />
        <AddPlacePopup  isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/> 
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;