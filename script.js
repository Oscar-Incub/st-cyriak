document.getElementById('year').textContent = new Date().getFullYear();

// --Top Button
    const toTopBtn = document.getElementById('to-top-btn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            toTopBtn.style.display = 'block';
        } else {
            toTopBtn.style.display = 'none';
        }
    });
    toTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
   /*-----*/     
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .fade-in-up, .card-animate').forEach(el => observer.observe(el));

/*-----*/    
  
        const slides = document.querySelectorAll('.hero-image-slider .slider-img');
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4000);

/*---header scroll--*/    
function setHeaderSmall() {
    const header = document.querySelector('header');
    // На мобильных не трогаем класс
    if (window.innerWidth > 920) {
        if(window.scrollY > 40) {
            header.classList.add('header-small');
        } else {
            header.classList.remove('header-small');
        }
        header.style.transition = '';
    } else {
        header.classList.remove('header-small');
        header.style.transition = 'none';
    }
}
window.addEventListener('resize', setHeaderSmall);
window.addEventListener('scroll', setHeaderSmall);
document.addEventListener('DOMContentLoaded', setHeaderSmall);    
    // function setHeaderSmall() {
    //     const header = document.querySelector('header');
    //     if (window.innerWidth <= 920) {
    //         header.classList.add('header-small');
    //         header.style.transition = 'none';
    //     } else {
    //         header.classList.remove('header-small');
    //         header.style.transition = ''; 
    //     }
    // }
    // window.addEventListener('resize', setHeaderSmall);
    // document.addEventListener('DOMContentLoaded', setHeaderSmall);

    
    // window.addEventListener('scroll', function() {
    //     const header = document.querySelector('header');
    //     if (window.innerWidth > 920) {
    //         if(window.scrollY > 40) {
    //             header.classList.add('header-small');
    //         } else {
    //             header.classList.remove('header-small');
    //         }
    //     }
    // });


    
/*-----*/    
            document.querySelector('.cta-btn').addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('contact-modal').style.display = 'flex';
            });
            document.querySelector('.modal-close').addEventListener('click', function() {
                document.getElementById('contact-modal').style.display = 'none';
            });
            document.getElementById('contact-modal').addEventListener('click', function(e) {
                if (e.target === this) this.style.display = 'none';
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.getElementById('contact-modal').style.display = 'none';
                }
            });

            const burger = document.querySelector('.burger');
            const navMenu = document.querySelector('.nav-menu');
            const backdrop = document.querySelector('.menu-backdrop');

            function closeMenu() {
                navMenu.classList.remove('open');
                burger.classList.remove('open');
                backdrop.classList.remove('active');
            }

            burger.addEventListener('click', function() {
                navMenu.classList.toggle('open');
                burger.classList.toggle('open');
                backdrop.classList.toggle('active');
            });
            backdrop.addEventListener('click', closeMenu);
            window.addEventListener('resize', function() {
                if(window.innerWidth > 920) closeMenu();
            });
