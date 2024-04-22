const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

let isDragging = false, starX, startScrollleft;
//Number cards
let cardPerview =Math.round(carousel.offsetWidth / firstCardWidth);


//copies of card insertion
carouselChildrens.slice(cardPerview).reverse().forEach(card =>{
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens.slice(0,cardPerview).forEach(card =>{
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});
//arrow buttons left and right
arrowBtns.forEach(btn => {
    btn.addEventListener( "click", () => { 
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStrart =(e)=>{
    isDragging=true;
    carousel.classList.add("dragging");
    //cursor scrolll
    starX = e.pageX;
    startScrollleft = carousel.scrollLeft;
}
const dragging =(e) => {
    if (!isDragging) return; // hold drag
    carousel.scrollLeft = startScrollleft -(e.pageX-starX); //scroll position
}
const dragStop = () =>{    
    isDragging=false;
    carousel.classList.remove("dragging");
}

carousel.addEventListener("mousedown", dragStrart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
