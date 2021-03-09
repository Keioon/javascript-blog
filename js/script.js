'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* [Done] remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active to the clicked link */
  clickedElement.classList.add('active');


  /* [Done] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
    
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
    
  /* find the correct article using  the selector (value of 'href' atribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
    
  let html='';
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
      
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      
    /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      
    /* create HTML of the link */
    /*
    titleList.insertAdjacentHTML('beforend', linkHTML);
    podstawy->dom->obiekty kursjs
    */
      
    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
    
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {max: 0, min: 999999};
  for (let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;    
}

function calculateTagClass(count, params){
  const normalizeCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizeCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new obiect allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const wrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>' + ' ';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){ 
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      }
      else{
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    wrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>, ';
    allTagsHTML += tagLinkHTML;
    console.log('tagLinkHTML: ', tagLinkHTML);  
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
  console.log('tagList: ', tagList); 
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */  
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let hrefTag of hrefTags){
    /* add class active */
    hrefTag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linkTags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let linkTag of linkTags){
  /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorsParams(authors){
  const params = {max: 0, min: 9999};
  for(let author in authors){
    if(authors[author] > params.max){
      params.max = authors[author];
    } 
    else if (authors[author] < params.min){
      params.min = authors[author];
    } 
  }
  return params;
}

function calculateAuthorClass(count, params){
  const normalizeCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizeCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateAuthors(){
  /* [NEW] create a new obiect allAuthors with an empty array */
  let allAuthors = {};
  /* find all authors */
  const authors = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every authors: */
  for(let author of authors){
    /* find tags wrapper */
    const authorWrapper = author.querySelector(optArticleAuthorSelector);
    /* get tags from post-autor attribute */
    const authorTag = author.getAttribute('data-author');  
    /* make html variable with empty string */
    let html = '';
    console.log('authorTag: ', authorTag);
    /* generate HTML of the link */
    const linkHTML = '<a href="#author-' + authorTag + '">' + authorTag + '</a>';
    console.log('linkHTML: ', linkHTML);
    /* add generated code to html variable */
    html = html + linkHTML;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[authorTag]){ //!allAuthors.hasOwnProperty(author)
      /* [NEW] add author to allauthors object */
      allAuthors[authorTag] = 1;
      console.log('authorTag: ', authorTag); 
    }
    else{
      allAuthors[authorTag]++;
    }    
    authorWrapper.innerHTML = html; /* insert HTML of all the links into the tags wrapper */
    console.log('authorWrapper: ', authorWrapper);
    /* END LOOP: for every authors: */
  }
  /* [NEW] find list of authors in right column */
  const authorsList = document.querySelector('.authors');
  const authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorsParams: ', authorsParams);
  let allAuthorsHTML = '';
  console.log('allAuthorsHTML ', allAuthorsHTML);    
  for(let author in allAuthors){
    const authorsLinkHTML = '<li><a class="' + calculateAuthorClass(allAuthors[author], authorsParams) + '" href="#tag-' + allAuthors[author] + '">' + author + '</a></li>, ';
    console.log('authorsLinkHTML : ', authorsLinkHTML);  
    allAuthorsHTML += authorsLinkHTML;
  }
  /* [NEW] add html from allAuthors to authorsList */
  authorsList.innerHTML = allAuthorsHTML;
  console.log('authorsList: ', authorsList); 
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this; 
  console.log('clickedElement: ', clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', ''); 
  /* find all tag links with class active */
  const authorTags = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for(let authoreTag of authorTags){
    /* remove class active */
    authoreTag.classList.remove('active');
    /* END LOOP: for each active tag link */  
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let hrefTag of hrefTags){
    /* add class active */
    hrefTag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
  console.log('generateTitleLinks: ', generateTitleLinks);
}


function addClickListenersToAuthors(){
  /* find all links to authortags */
  const linkAuthors = document.querySelectorAll('a[href^="#author-"]');
  console.log('linkAuthors: ', linkAuthors);
  /* START LOOP: for each link */  
  for(let linkAuthor of linkAuthors){
    /* add tagClickHandler as event listener for that link */
    linkAuthor.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
