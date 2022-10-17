class RatingWidget {
  constructor(article) {
    //Building widget dom
    this.articleId = article.getAttribute('data-article-id');

    this.ratingForm = this._createElement('form', {
      'class': 'article__rating',
      'action': '/',
    });

    let hiddenInput = this._createElement('input', {
      'type': 'hidden',
      'name': 'article-id',
      'value': this.articleId,
    });
    this.ratingForm.appendChild(hiddenInput);

    this.hiddenInput = this._createElement('input', {
      'type': 'hidden',
      'name': 'article-rating',
    });
    this.ratingForm.appendChild(this.hiddenInput);

    let ratingFields = this._createElement('fieldset', {
      'class': 'article__rating-fields',
    });

    let legend = this._createElement('legend', {
      'class': 'article__rating-legend'
    }, 'Как вам статья?');
    ratingFields.appendChild(legend);

    let ratingText = ['Очень понравилось', 'В целом понравилось', 'В целом не понравилось', 'Очень не понравилось'];

    this.radio = [];

    for(let i = 0; i < ratingText.length; i++) {
      let radioWrapper = this._createElement('div', {
        'class': 'article__rating-radio-wrapper',
      });

      this.radio[i] = this._createElement('input', {
        'class': 'article__rating-radio',
        'type': 'radio',
        'name': 'article-rating-radio',
        'value': String(ratingText.length - i),
        'aria-label': ratingText[i],
      });

      this.radio[i].addEventListener('change', this._handleRadioChange.bind(this, this.radio[i]));

      let ratingEmoji = this._createElement('div', {
        'class': 'article__rating-emoji',
      });

      radioWrapper.appendChild(this.radio[i]);
      radioWrapper.appendChild(ratingEmoji);

      ratingFields.appendChild(radioWrapper);
    }

    this.ratingForm.appendChild(ratingFields);

    this.textWrapper = this._createElement('div', {
      'class': 'article__rating-text-wrapper',
    });

    this.textArea = this._createElement('textarea', {
      'class': 'article__rating-text',
      'name': 'article-rating-msg',
      'placeholder': 'Посоветуйте, что мы могли бы улучшить',
    });

    let submitBtn = this._createElement('button', {
      'class': 'article__rating-btn',
    }, 'Отправить');

    this.textWrapper.appendChild(this.textArea);
    this.textWrapper.appendChild(submitBtn);

    this.ratingForm.appendChild(this.textWrapper);



    //Event listeners
    document.addEventListener('click', this._handleDocumentClick.bind(this));
    this.ratingForm.addEventListener('submit', this._submitForm.bind(this));
    window.addEventListener('storage', this._checkSavedState.bind(this));



    //Check for saved rating
    this._checkSavedState.call(this);



    //Render widget
    article.querySelector('.article__aside').appendChild(this.ratingForm);
  }


  _createElement(tagName, attributes, innerText = null) {
    let element = document.createElement(tagName);

    for(let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    if(innerText) element.innerText = innerText;
    return element;
  }


  _handleRadioChange(radio) {
    this.hiddenInput.value = radio.value;
    this._disableForm.call(this);
    if(radio.value < 3) {
      let radioCoords = radio.getBoundingClientRect();
      this.textWrapper.style.top = radioCoords.top + Math.abs(radioCoords.height / 2) + window.pageYOffset + 'px';
      this.textWrapper.style.left = radioCoords.left + Math.abs(radioCoords.width) + window.pageXOffset + 'px';
      this.textWrapper.classList.add('article__rating-text-wrapper--active');
      setTimeout(() => {
        this.textArea.focus();
      }, 300)
    } else {
      this._submitForm.call(this);
    }
  }


  _handleDocumentClick(e) {
    if((!this.textWrapper.contains(e.target)) && this.textWrapper.classList.contains('article__rating-text-wrapper--active')) {
      this.textWrapper.classList.remove('article__rating-text-wrapper--active');
      this.textWrapper.removeAttribute('style');
      this._submitForm.call(this);
    }
  }


  _disableForm() {
    this.radio.forEach(radio => {
      radio.setAttribute('disabled', '');
    });
  }


  _submitForm(e) {
    if(e) e.preventDefault();
    this.textWrapper.classList.remove('article__rating-text-wrapper--active');
    this.textWrapper.removeAttribute('style');
    let formData = new FormData(this.ratingForm);
    let formDataJSON = {};
    formData.forEach((value, key) => formDataJSON[key] = value.toString());

    localStorage.setItem(`rating-for:${this.articleId}`, formDataJSON['article-rating']);

    console.log(formDataJSON);
    //send data to server
  }

  _checkSavedState() {
    let savedState = localStorage.getItem(`rating-for:${this.articleId}`);
    if(savedState) {
      this.radio[this.radio.length - savedState].setAttribute('checked', '');
      this._disableForm.call(this);
    }
  }
}
