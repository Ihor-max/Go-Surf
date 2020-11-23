$(function () {
    $('.header__slider').slick({
        infinite: true,
        fade: true,
        prevArrow: '<img class="slider-arrows slider-arrows__left" src="/app/img/arrow-left.svg" alt=""></img>',
        nextArrow: '<img class="slider-arrows slider-arrows__right" src="/app/img/arrow.svg" alt=""></img>',
        asNavFor: '.slider-dots'
    });
    $('.slider-dots').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        asNavFor: '.header__slider',
 

    });
    $('.surf-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
    })


});