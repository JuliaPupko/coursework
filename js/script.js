// слайдер 
const swiper = new Swiper('.tabs__swiper', {
  slidesPerView: 2,
  slidesPerGroup: 2,
  spaceBetween: 10,
  pagination: {
    el: '.tabs__pagination',
    type: 'bullets',
  },
  navigation: {
    nextEl: '.tabs__btn-next',
    prevEl: '.tabs__btn-prev',
  },
  loop: false,
  breakpoints: {
    1220: {
      spaceBetween: 40,
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
    1024: {
      spaceBetween: 20,
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
    768: {
      spaceBetween: 40,
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
    651: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
    501: {
      spaceBetween: 20,
    }
  }
});

// селект
const choices = new Choices("#select-status", {
  searchEnabled: false,
  shouldSort: false,
  itemSelectText: "",
  position: 'bottom',
  duplicateItemsAllowed: false,
});
const select = document.querySelector('.choices');

// эффекты инпутов
const formElements = [...document.querySelectorAll('.form__element')];

formElements.push(select);
formElements.forEach(function(el) {
  el.addEventListener('focus', function() {
    el.parentElement.classList.add('form__content_is-focus');
  })
  el.addEventListener('blur', function() {
    el.parentElement.classList.remove('form__content_is-focus');
  })
})

// аккордеон
function openDropDownBlock(block) {
  const height = block.querySelector(".accordion__text").offsetHeight;
  const accordionItem = block.parentElement;
  const expandIcon = accordionItem.querySelector(".accordion__svg");
  const activeBlockList = document.querySelectorAll(".accordion__dropdown_active");

  activeBlockList.forEach(function(activeBlock) {
    closeDropDownBlock(activeBlock);
  });
  
  triggerUnlockedForOpening = false;
  block.classList.add("accordion__dropdown_active");
  block.style.height = height + "px";
  accordionItem.setAttribute("data-active", true);
  expandIcon.classList.add("accordion__svg_rotated");

  setTimeout(function() {
      triggerUnlockedForOpening = true;
  }, 500);
}

function closeDropDownBlock(block) {
  const accordionItem = block.parentElement;
  const expandIcon = accordionItem.querySelector(".accordion__svg");

  triggerUnlockedForClosing = false;
  block.style.height = "0";
  expandIcon.classList.remove("accordion__svg_rotated");

  setTimeout(function() {
      block.classList.remove("accordion__dropdown_active");
      accordionItem.removeAttribute("data-active");
      triggerUnlockedForClosing = true;
  }, 500);
}

var triggerUnlockedForOpening = true;
var triggerUnlockedForClosing = true;
const triggerList = document.querySelectorAll(".accordion__trigger");
const dropDownBlockList = document.querySelectorAll(".accordion__dropdown");

triggerList.forEach(function(trigger) {
  trigger.addEventListener("click", function(click) {
      if(triggerUnlockedForOpening && triggerUnlockedForClosing) {
          const path = trigger.dataset.path;
          const block = document.querySelector(`.accordion__dropdown[data-target="${path}"]`);

          if(block.classList.contains("accordion__dropdown_active")) {
              closeDropDownBlock(block);
          }
          else {
              openDropDownBlock(block);
          }
      }
  });
});

// меню
const burger = document.querySelector('.header__burger');
const burgerClose = document.querySelector('.nav__close');
const menu = document.querySelector('.header__nav');

burger.addEventListener('click', function() {
  menu.classList.add('nav_active');
  burgerClose.focus();
});

burgerClose.addEventListener('click', function() {
  menu.classList.add('nav_disappearance');
  burger.focus();
  
  setTimeout(function() {
    menu.classList.remove('nav_disappearance');
    menu.classList.remove('nav_active');
  }, 500);
});

// модальное
const opening = document.querySelector('.storage__btn');
const closing = document.querySelector('.adding__btn-close');
const adding = document.querySelector('.adding');
const body = document.querySelector('body');
const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

function openModal() {
  adding.classList.add('adding__open');
  body.classList.add('body__locked');
  header.setAttribute('inert', 'true');
  main.setAttribute('inert', 'true');
  footer.setAttribute('inert', 'true');

  setTimeout(function() {
    closing.focus();
  }, 300);
}

function closeModal() {
  adding.classList.add('adding__close');

  setTimeout(function() {
    adding.classList.remove('adding__open');
    adding.classList.remove('adding__close');
    body.classList.remove('body__locked');
    header.removeAttribute('inert');
    main.removeAttribute('inert');
    footer.removeAttribute('inert');
    opening.focus();
  }, 300);
}

opening.addEventListener('click', openModal);
closing.addEventListener('click', closeModal);

// функция проверки формы добавления
function checkForm(event) {
  const form = event.target.closest('.form');
  validateForm(form);
}

// функция валидации формы добавления
function validateForm(form) {
  const categorySet = form.querySelector('.form__category');
  const radioChecked = categorySet.querySelector('input[type="radio"]:checked');
  const inputNumber = form.querySelector('.form__number');
  const inputDocName = form.querySelector('.form__doc-name');
  const inputStartDate = form.querySelector('.form__start-date');
  const inputFinishDate = form.querySelector('.form__finish-date');
  const startDate = new Date(inputStartDate.value);
  const finishDate = new Date(inputFinishDate.value);
  const invalidList = [];

  form.classList.remove('form_invalid');
  form.querySelectorAll('.form__content_invalid').forEach(function(fieldset) {
    fieldset.classList.remove('form__content_invalid');
  });
  
  if (radioChecked === null) {
    invalidList.push(categorySet);
  }
  if (inputNumber.value === '') {
    invalidList.push(inputNumber.parentElement)
  }
  if (inputDocName.value === '') {
    invalidList.push(inputDocName.parentElement)
  }
  if (inputStartDate.value === '') {
    invalidList.push(inputStartDate.parentElement)
  }
  if (inputFinishDate.value === '' || finishDate.getTime() < startDate.getTime()) {
    invalidList.push(inputFinishDate.parentElement)
  }
  if (invalidList.length > 0) {
    form.classList.add('form_invalid');
    form.addEventListener('change', checkForm);
    for (let element of invalidList) {
      element.classList.add('form__content_invalid');
    }
    return false;
  }
  return true;
}

const addingForm = document.querySelector('.adding__form');
const doneBtn = addingForm.querySelector('.done-btn');

// добавление нового документа
doneBtn.addEventListener('click', function() {
  const formStatus = validateForm(addingForm);

  if (formStatus) {
    closing.click();
    let info = getInfo(addingForm);
    pushDoc(info);
    placeDoc(info);
    docList.push(info);
  }
});

// функция проверки формы фильтрации
function checkFilterForm(event) {
  const form = event.target.closest('.form');
  validateFilterForm(form);
}

// функция валидации формы фильтрации
function validateFilterForm(form) {
  let isValid = true;
  const inputStartDate = form.querySelector('.form__start-date');
  const inputFinishDate = form.querySelector('.form__finish-date');

  form.classList.remove('form_invalid');
  form.querySelectorAll('.form__content').forEach(function(fieldset) {
    fieldset.classList.remove('form__content_invalid');
  });

  if ((inputStartDate.value !== '') && (inputFinishDate.value !== '')) {
    const startDate = new Date(inputStartDate.value);
    const finishDate = new Date(inputFinishDate.value);

    if (finishDate.getTime() < startDate.getTime()) {
      inputFinishDate.parentElement.classList.add('form__content_invalid');
      isValid = false;
    }
  }
  if (isValid === false) {
    form.classList.add('form_invalid');
    form.addEventListener('change', checkFilterForm);
  }
  
  return isValid;
};

// скрытие неподошедших под фильтр документов
const searchForm = document.querySelector('.search__form');
const searchFormBtn = searchForm.querySelector('.done-btn');

searchFormBtn.addEventListener('click', function() {
  const formStatus = validateFilterForm(searchForm);

  if (formStatus) {
    const filter = filterInfo();
    btnReset.click();
    for (let doc of docList) {
      if(!checkFilter(doc, filter)) {
        const docCard = document.querySelector(`.tabs__slide[data-id='${doc.id.toString()}']`);
        docCard.classList.add('tabs__slide_hidden');
      }
    }
    swiper.updateSlides();
  }
});

// сбор информации из формы
function getInfo(form) {
  let info = {};
  const categorySet = form.querySelector('.form__category');
  const radioChecked = categorySet.querySelector('input[type="radio"]:checked');
  const inputNumber = form.querySelector('.form__number');
  const inputStartDate = form.querySelector('.form__start-date');
  const inputFinishDate = form.querySelector('.form__finish-date');
  const inputDocName = form.querySelector('.form__doc-name');

  info.radioChecked = radioChecked.value;
  info.number = parseInt(inputNumber.value);
  info.startDate = inputStartDate.value;
  info.finishDate = inputFinishDate.value;
  info.docName = inputDocName.value;
  info.id = parseInt(localStorage.getItem("docNum")) + 1;

  return info;
}

// добавлние в localstorage 
if (localStorage.getItem("docNum") === null) {
  localStorage.setItem("docNum", "0");
}

// функция добавления в localstorage
function pushDoc(docObj) {
  localStorage.setItem("docNum", (parseInt(localStorage.getItem("docNum")) + 1).toString());

  const strObj = JSON.stringify(docObj);
  const docKey = `doc-${localStorage.getItem("docNum")}`;
  
  localStorage.setItem(docKey, strObj);
}

// поиск в массиве документов по id
function searchById(id) {
  for (let i = 0; i < docList.length; i++) {
    if (docList[i].id === id) {
      return i;
    }
  }
}

// функция добавления/размещения документа
const tabsWrapper = document.querySelector('.tabs__wrapper');

function placeDoc(docObj) {
  const now = new Date();
  const startDate = new Date(docObj.startDate);
  const finishDate = new Date(docObj.finishDate);
  const slide = document.createElement('div');
  const tooltip = document.createElement('div');
  const tooltipMarker = document.createElement('button');
  const tooltipContent = document.createElement('div');
  const tooltipText = document.createElement('span');
  const tabsTitle = document.createElement('h3');
  const tabsHint = document.createElement('span');
  const tabsDocNum = document.createElement('span');
  const tabsPanel = document.createElement('div');
  const deleteBtn = document.createElement('button');

  let status = '';
  let statusColor = '';

  if (now.getTime() < startDate.getTime()) {
    status = 'Ожидает подпись';
    statusColor = 'blue';
  } else if (now.getTime() < finishDate.getTime()) {
    status = 'Действующий';
    statusColor = 'green';
  } else {
    status = 'Недействующий';
    statusColor = 'gray';
  }

  slide.classList.add('swiper-slide', 'tabs__slide');
  slide.setAttribute('data-id', docObj.id);
  tooltip.classList.add('tabs__tooltip', 'tooltip');
  tooltipMarker.classList.add('tooltip__marker', 'btn-reset');
  tooltipMarker.innerHTML = `<svg  width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.9797 1.02031C18.3262 0.367007 17.44 0 16.516 0C15.5919 0 14.7057 0.367007 14.0522 1.02031L7.52226 7.55029C7.4379 7.6344 7.37425 7.73697 7.33635 7.8499L5.41577 13.6117C5.37052 13.747 5.36385 13.8922 5.39652 14.0311C5.42918 14.17 5.49988 14.2971 5.6007 14.3981C5.70151 14.499 5.82846 14.5699 5.96731 14.6028C6.10616 14.6357 6.25142 14.6293 6.38681 14.5842L12.1486 12.6637C12.262 12.626 12.3652 12.5623 12.4497 12.4777L18.9797 5.94776C19.633 5.29428 20 4.40807 20 3.48403C20 2.56 19.633 1.67379 18.9797 1.02031ZM16.8793 10.2207C16.9939 11.7838 16.6277 13.3446 15.8297 14.6936C15.0318 16.0426 13.8403 17.1153 12.4152 17.7677C10.9901 18.42 9.3995 18.6209 7.85693 18.3433C6.31437 18.0657 4.89362 17.3229 3.78535 16.2147C2.67707 15.1064 1.9343 13.6856 1.6567 12.1431C1.3791 10.6005 1.57997 9.00994 2.23234 7.58482C2.88471 6.1597 3.95737 4.96822 5.30638 4.17026C6.65538 3.3723 8.21619 3.00605 9.77933 3.12066L11.136 1.76242C9.19138 1.34896 7.16517 1.57523 5.35964 2.4075C3.5541 3.23977 2.066 4.63342 1.1173 6.38059C0.168601 8.12776 -0.189858 10.1348 0.095394 12.1024C0.380646 14.0699 1.29432 15.8925 2.70013 17.2983C4.10595 18.7041 5.92856 19.6178 7.89611 19.9031C9.86366 20.1883 11.8707 19.8299 13.6179 18.8812C15.365 17.9325 16.7587 16.4444 17.591 14.6388C18.4232 12.8333 18.6495 10.8071 18.236 8.86243L16.8793 10.2207Z" fill="#BB1AA3"/></svg>`
  tooltipContent.classList.add('tooltip__content');
  tooltipText.classList.add('tooltip__text', `tooltip__text_${statusColor}`);
  tooltipText.innerText = status;
  tabsTitle.classList.add('tabs__title');
  tabsTitle.innerText = docObj.docName;
  tabsHint.classList.add('tabs__hint');
  tabsHint.innerText = docObj.radioChecked;
  tabsDocNum.classList.add('tabs__doc-num');
  tabsDocNum.innerText = `№ ${docObj.number}`;
  tabsPanel.classList.add('tabs__panel');
  deleteBtn.classList.add('tabs__btn', 'delete-btn', 'btn-reset');
  deleteBtn.innerHTML = `Удалить <svg class="tabs__btn_delete" width="19" height="20" viewbox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.85714 2.85714H10.7143C10.7143 2.47826 10.5638 2.1149 10.2959 1.84699C10.028 1.57908 9.6646 1.42857 9.28571 1.42857C8.90683 1.42857 8.54347 1.57908 8.27556 1.84699C8.00765 2.1149 7.85714 2.47826 7.85714 2.85714ZM6.42857 2.85714C6.42857 2.09938 6.72959 1.37266 7.26541 0.836838C7.80123 0.30102 8.52795 0 9.28571 0C10.0435 0 10.7702 0.30102 11.306 0.836838C11.8418 1.37266 12.1429 2.09938 12.1429 2.85714H17.8571C18.0466 2.85714 18.2283 2.9324 18.3622 3.06635C18.4962 3.20031 18.5714 3.38199 18.5714 3.57143C18.5714 3.76087 18.4962 3.94255 18.3622 4.0765C18.2283 4.21046 18.0466 4.28571 17.8571 4.28571H17.0514L15.33 16.9114C15.2132 17.767 14.7904 18.5514 14.1399 19.1192C13.4893 19.6871 12.655 20 11.7914 20H6.78C5.91645 20 5.08216 19.6871 4.43157 19.1192C3.78099 18.5514 3.35818 17.767 3.24143 16.9114L1.52 4.28571H0.714286C0.524845 4.28571 0.343164 4.21046 0.209209 4.0765C0.0752549 3.94255 0 3.76087 0 3.57143C0 3.38199 0.0752549 3.20031 0.209209 3.06635C0.343164 2.9324 0.524845 2.85714 0.714286 2.85714H6.42857ZM7.85714 7.85714C7.85714 7.6677 7.78189 7.48602 7.64793 7.35207C7.51398 7.21811 7.3323 7.14286 7.14286 7.14286C6.95342 7.14286 6.77174 7.21811 6.63778 7.35207C6.50383 7.48602 6.42857 7.6677 6.42857 7.85714V15C6.42857 15.1894 6.50383 15.3711 6.63778 15.5051C6.77174 15.639 6.95342 15.7143 7.14286 15.7143C7.3323 15.7143 7.51398 15.639 7.64793 15.5051C7.78189 15.3711 7.85714 15.1894 7.85714 15V7.85714ZM11.4286 7.14286C11.618 7.14286 11.7997 7.21811 11.9336 7.35207C12.0676 7.48602 12.1429 7.6677 12.1429 7.85714V15C12.1429 15.1894 12.0676 15.3711 11.9336 15.5051C11.7997 15.639 11.618 15.7143 11.4286 15.7143C11.2391 15.7143 11.0574 15.639 10.9235 15.5051C10.7895 15.3711 10.7143 15.1894 10.7143 15V7.85714C10.7143 7.6677 10.7895 7.48602 10.9235 7.35207C11.0574 7.21811 11.2391 7.14286 11.4286 7.14286ZM4.65714 16.7186C4.72725 17.2318 4.98092 17.7023 5.37121 18.043C5.76149 18.3836 6.26196 18.5714 6.78 18.5714H11.7914C12.3097 18.5717 12.8105 18.3841 13.2011 18.0435C13.5917 17.7028 13.8456 17.2321 13.9157 16.7186L15.61 4.28571H2.96143L4.65714 16.7186Z" fill="#E38AD6"/></svg>`

  tooltipContent.append(tooltipText);
  tooltip.append(tooltipMarker);
  tooltip.append(tooltipContent);
  tabsPanel.append(deleteBtn); 
  slide.append(tooltip);
  slide.append(tabsTitle);
  slide.append(tabsDocNum);
  slide.append(tabsHint);
  slide.append(tabsPanel);
  tabsWrapper.append(slide);

  // удаление документа
  deleteBtn.addEventListener('click', function() {
    localStorage.removeItem(`doc-${docObj.id}`);
    slide.remove();
    docList.splice(searchById(docObj.id), 1);
    swiper.updateSlides();
  });
  swiper.updateSlides();
}

// функция получения списка документов
function getDocList() {
  const keysList = Object.keys(localStorage);
  const docList = [];

  for (key of keysList) {
    if (/^doc-\d+$/.test(key)) {
      docList.push(JSON.parse(localStorage.getItem(key)));
    }
  }
  return docList;
}

// размещение новых документов
const docList = getDocList();
docList.forEach(function(doc) {
  placeDoc(doc);
})

// функция сбора информации для фильтра
function filterInfo() {
  let filter = {};
  const selectedStatus = searchForm.querySelector('option');
  const categorySet = searchForm.querySelectorAll('.form__native-checkbox:checked');
  const inputNumber = searchForm.querySelector('.form__number');
  const inputStartDate = searchForm.querySelector('.form__start-date');
  const inputFinishDate = searchForm.querySelector('.form__finish-date');
  const inputDocName = searchForm.querySelector('.form__doc-name');

  filter.status = selectedStatus.innerText;
  filter.number = parseInt(inputNumber.value);
  filter.startDate = inputStartDate.value;
  filter.finishDate = inputFinishDate.value;
  filter.docName = inputDocName.value;
  filter.typeList = [];

  for (let checkbox of categorySet) {
    filter.typeList.push(checkbox.value);
  }

  return filter;
}

// функция проверки документа на фильтр
function checkFilter(docObj, filter) {
  const now = new Date();
  const startDate = new Date(docObj.startDate);
  const finishDate = new Date(docObj.finishDate);
  const filterStartDate = new Date(filter.startDate);
  const filterFinishDate = new Date(filter.finishDate);
  let status = '';

  if (now.getTime() < startDate.getTime()) {
    status = 'Ожидает подпись';
  } else if (now.getTime() < finishDate.getTime()) {
    status = 'Действующий';
  } else {
    status = 'Недействующий';
  }
  if (filter.status !== 'Не выбрано' && filter.status !== status) {
    return false;
  }
  if (filter.number !== docObj.number && !isNaN(filter.number)) {
    return false;
  }
  if (filterStartDate !== '') {
    if (filterStartDate.getTime() > startDate.getTime()) {
      return false;
    }
  }
  if (filterFinishDate !== '') {
    if (filterFinishDate.getTime() < finishDate.getTime()) {
      return false;
    }
  }
  if (!docObj.docName.includes(filter.docName)) {
    return false;
  }
  if (filter.typeList.length > 0 && !filter.typeList.includes(docObj.radioChecked)) {
    return false;
  }
  return true;
}

// сброс фильтров
const btnReset = document.querySelector('.storage__reset');

btnReset.addEventListener('click', function() {
  const activeBtn = document.querySelector('.tabs-nav__btn_active');

  document.querySelectorAll('.tabs__slide_hidden').forEach(function(doc) {
    doc.classList.remove('tabs__slide_hidden');
  });

  if (activeBtn !== null) {
    activeBtn.classList.remove('tabs-nav__btn_active');
  }

  swiper.updateSlides();
});

// фильтр по табам
const tabBtnList = document.querySelectorAll('.tabs-nav__btn');

tabBtnList.forEach(function(btn) {
  btn.addEventListener('click', function() {
    const typeDoc = btn.innerText;

    tabBtnList.forEach(function(btn) {
      btn.classList.remove('tabs-nav__btn_active');
    });

    btnReset.click();
    btn.classList.add('tabs-nav__btn_active');

    docList.forEach(function(doc) {
      if (doc.radioChecked !== typeDoc) {
        const docCard = document.querySelector(`.tabs__slide[data-id='${doc.id.toString()}']`);
        docCard.classList.add('tabs__slide_hidden');
      }
    })
    
    swiper.updateSlides();
  })
})
