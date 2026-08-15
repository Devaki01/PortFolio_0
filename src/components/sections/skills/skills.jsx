import React from "react";
import "./skills.css";

const skillStacks = [
  {
    id: "web",
    number: "01",
    title: "Web Development",
    subtitle: "BUILDING DIGITAL EXPERIENCES",
    skills: [
      {
        name: "React",
        icon: "https://cdn.simpleicons.org/react/61DAFB",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
      },
      {
        name: "HTML5",
        icon: "https://cdn.simpleicons.org/html5/E34F26",
      },
      {
        name: "CSS3",
        icon: "https://cdn.simpleicons.org/css3/1572B6",
      },
      {
        name: "Node.js",
        icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
      },
      {
        name: "Express",
        icon: "https://cdn.simpleicons.org/express/FFFFFF",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.simpleicons.org/mongodb/47A248",
      },
      {
        name: "Next.js",
        icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
      },
    ],
  },

  {
    id: "design",
    number: "02",
    title: "UI / UX & Design",
    subtitle: "DESIGNING WITH INTENTION",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.simpleicons.org/figma/F24E1E",
      },
      {
        name: "Framer",
        icon: "https://cdn.simpleicons.org/framer/FFFFFF",
      },
      {
        name: "UI Design",
        icon: "https://cdn.simpleicons.org/materialdesign/FFFFFF",
      },
      {
        name: "UX Research",
        icon: "https://cdn.simpleicons.org/usercentrics/FFFFFF",
      },
      {
        name: "Prototyping",
        icon: "https://cdn.simpleicons.org/proto/FFFFFF",
      },
      {
        name: "Design Systems",
        icon: "https://cdn.simpleicons.org/storybook/FF4785",
      },
    ],
  },

  {
    id: "ml",
    number: "03",
    title: "AI / Machine Learning",
    subtitle: "EXPLORING INTELLIGENT SYSTEMS",
    skills: [
      {
        name: "Python",
        icon: "https://cdn.simpleicons.org/python/3776AB",
      },
      {
        name: "TensorFlow",
        icon: "https://cdn.simpleicons.org/tensorflow/FF6F00",
      },
      {
        name: "PyTorch",
        icon: "https://cdn.simpleicons.org/pytorch/EE4C2C",
      },
      {
        name: "Scikit-learn",
        icon: "https://cdn.simpleicons.org/scikitlearn/F7931E",
      },
      {
        name: "Pandas",
        icon: "https://cdn.simpleicons.org/pandas/150458",
      },
      {
        name: "NumPy",
        icon: "https://cdn.simpleicons.org/numpy/013243",
      },
      {
        name: "OpenCV",
        icon: "https://cdn.simpleicons.org/opencv/5C3EE8",
      },
      {
        name: "Jupyter",
        icon: "https://cdn.simpleicons.org/jupyter/F37626",
      },
    ],
  },

  {
    id: "cloud",
    number: "04",
    title: "Cloud & DevOps",
    subtitle: "BUILDING RELIABLE INFRASTRUCTURE",
    skills: [
      {
        name: "AWS",
        icon: "https://cdn.simpleicons.org/amazonwebservices/FF9900",
      },
      {
        name: "Docker",
        icon: "https://cdn.simpleicons.org/docker/2496ED",
      },
      {
        name: "Git",
        icon: "https://cdn.simpleicons.org/git/F05032",
      },
      {
        name: "GitHub",
        icon: "https://cdn.simpleicons.org/github/FFFFFF",
      },
      {
        name: "Postman",
        icon: "https://cdn.simpleicons.org/postman/FF6C37",
      },
      {
        name: "Vercel",
        icon: "https://cdn.simpleicons.org/vercel/FFFFFF",
      },
      {
        name: "Terraform",
        icon: "https://cdn.simpleicons.org/terraform/7B42BC",
      },
      {
        name: "CI / CD",
        icon: "https://cdn.simpleicons.org/githubactions/2088FF",
      },
    ],
  },
];

const Skills = () => {
  return (
    <section className="skills-page">

      {/* Decorative geometry */}
      <div className="skills-shape skills-shape--top-left" />
      <div className="skills-shape skills-shape--top-right" />
      <div className="skills-shape skills-shape--bottom-left" />
      <div className="skills-shape skills-shape--bottom-right" />

      {/* Fixed section label */}
      <div className="skills-label">
        <span>SKILLS</span>
        <div className="skills-label__line" />
      </div>

      {/* Scrollable stacks */}
      <div className="skills-scroll">

        {skillStacks.map((stack) => (
          <article
            className="skills-stack"
            key={stack.id}
          >

            <div className="skills-stack__header">

              <div className="skills-stack__number">
                {stack.number}
              </div>

              <div>
                <p className="skills-stack__subtitle">
                  {stack.subtitle}
                </p>

                <h2 className="skills-stack__title">
                  {stack.title}
                </h2>
              </div>

            </div>


            <div className="skills-stack__content">

              <div className="skills-stack__description">
                <span>01</span>
                <p>
                  Technologies, tools and systems
                  I use to turn ideas into working
                  products.
                </p>
              </div>


              <div className="skills-grid">

                {stack.skills.map((skill) => (
                  <div
                    className="skill-card"
                    key={skill.name}
                  >

                    <div className="skill-card__icon">
                      <img
                        src={skill.icon}
                        alt=""
                        loading="lazy"
                      />
                    </div>

                    <span className="skill-card__name">
                      {skill.name}
                    </span>

                    <span className="skill-card__arrow">
                      ↗
                    </span>

                  </div>
                ))}

              </div>

            </div>


            <div className="skills-stack__footer">
              <span>SCROLL TO EXPLORE</span>

              <span className="skills-stack__scroll-line">
                <span />
              </span>
            </div>

          </article>
        ))}

      </div>

    </section>
  );
};

export default Skills;