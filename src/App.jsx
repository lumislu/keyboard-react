import React, { Suspense, useEffect, useRef } from "react";
import { gsap, ScrollToPlugin } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  gsap.registerPlugin(ScrollToPlugin);
  gsap.registerPlugin(ScrollTrigger);

  const Spline = React.lazy(() => import("@splinetool/react-spline"));
  
  const keyboard = useRef();
  const keysRef = useRef(null);
  let animationInterval;

  function onLoad(spline) {
    const obj = spline.findObjectByName("keyboard");

    if (obj) {
      gsap.set(obj.scale, { x: 1, y: 1, z: 1 });
      gsap.set(obj.position, { x: 350, y: 0 });

      let rotateKeyboard = gsap.to(obj.rotation, {
        y: obj.rotation.y + 2,
        x: 0,
        z: 0,
        duration: 10,
        yoyo: true,
        repeat: -1,
        ease: "none",
      });

      let interval;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#part2",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            onEnter: () => {
              interval = setInterval(() => {
                obj.emitEvent("keyDown", "keyboard");
              }, 1500);

              rotateKeyboard.pause();
            },
            onLeaveBack: () => {
              const newProgress = obj.rotation.y / (Math.PI * 2);
              rotateKeyboard.progress(newProgress).resume();
              clearInterval(interval);
            },
          },
        })
        .to(obj.rotation, { x: -0.2, y: 7, z: 0.5 }, 0)
        .to(obj.position, { x: -300, y: 20, z: 0 }, 0)
        .to(obj.scale, { x: 1.6, y: 1.6, z: 1.6 }, 0);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#part3",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .to(obj.rotation, { x: 0, y: 7, z: 0 }, 0)
        .to(obj.position, { x: 50, y: 0 }, 0)
        .to(obj.scale, { x: 0.8, y: 0.8, z: 0.8 }, 0);
    }
    keyboard.current = obj;
  }

  function startRandomKeyAnimation() {
    const keys = keysRef.current.querySelectorAll(".key");
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    randomKey.style.animation = "text-jump 0.2s ease-in-out";

    randomKey.addEventListener("animationend", () => {
      randomKey.style.animation = "";
    });
  }
  function playRandomKeyAnimation() {
    startRandomKeyAnimation();

    animationInterval = setInterval(() => {
      startRandomKeyAnimation();
    }, 100 + Math.random() * 500);
  }
  function animateBar(triggerElement, onEnterWidth, onLeaveBackWidth) {
    gsap.to(".bar", {
      scrollTrigger: {
        trigger: triggerElement,
        start: "top center",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          gsap.to(".bar", {
            width: onEnterWidth,
            duration: 0.2,
            ease: "none",
          });
        },
        onLeaveBack: () => {
          gsap.to(".bar", {
            width: onLeaveBackWidth,
            duration: 0.2,
            ease: "none",
          });
        },
      },
    });
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      let windowHeight = window.innerHeight;
      let currentY = window.scrollY;

      if (e.key === "s" || e.key === "S") {
        gsap.to(window, {
          scrollTo: { y: currentY + windowHeight, autoKill: false },
          duration: 0.2,
          ease: "Power2.easeOut",
        });
      }
      if (e.key === "w" || e.key === "W") {
        gsap.to(window, {
          scrollTo: { y: currentY - windowHeight, autoKill: false },
          duration: 0.2,
          ease: "Power2.easeOut",
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    playRandomKeyAnimation();
    animateBar("#part1", "35%", "0%");
    animateBar("#part2", "65%", "35%");
    animateBar("#part3", "100%", "65%");
    return () => {
      clearInterval(animationInterval);
    };
  }, [animationInterval]);

  return (
    <div className="position-relative  ">
      <div className="bar"></div>
      <div className=" position-fixed  vw-100  vh-100  spline z-n1  ">
        <Suspense fallback={<div>Loading...</div>}>
          <Spline
            scene="https://prod.spline.design/JlP0AkPJE1x-3cVP/scene.splinecode"
            onLoad={onLoad}
            ref={keyboard}
          />
        </Suspense>
      </div>
      <main className=" container ">
        <nav className="  fs-2 p-4 bg-primary position-fixed">
          <span className="  start-0 text-white  fw-bold  ">keyboard</span>
        </nav>
        <header
          id="part1"
          className="vh-100 d-flex align-items-center   gap-3  "
        >
          <div className="d-flex  flex-column  gap-5 ">
            <h1 className="text-black opacity-75 ">
              Design your
              <div
                className="d-flex flex-nowrap "
                id="text-animation"
                ref={keysRef}
              >
                <span className="key">k</span>
                <span className="key">e</span>
                <span className="key">y</span>
                <span className="key">b</span>
                <span className="key">o</span>
                <span className="key">a</span>
                <span className="key">r</span>
                <span className="key">d</span>
              </div>
            </h1>
            <div className="fs-4 text-secondary ">
              <p className=" fw-bold  ">Action Guide</p>
              <p className="fs-5">
                Press 'W' to scroll up and 'S' to scroll down.
              </p>
            </div>
          </div>
        </header>

        <section
          id="part2"
          className="vh-100 d-flex align-items-center  gap-3 text-white  opacity-75  "
        >
          <div className="col-4 ms-auto ">
            <h1>Customize Your Keyboard</h1>
            <p className="fs-4   ">
              Choose keyboard color, style, keycaps, and more!"
            </p>
          </div>
        </section>

        <footer
          id="part3"
          className="vh-100 d-flex flex-column  align-items-center  justify-content-end  text-white  opacity-75 p-5  "
        >
          <h1 className="">#Spline3DAndGSAPAnimations</h1>
          <button className=" btn rounded-3  p-3 fs-3  btn-dark t ">
            more
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
