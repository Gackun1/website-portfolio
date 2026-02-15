"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import AnimatedSVG from "./components/AnimatedSVG/AnimatedSVG";

export default function Home() {
  // Form state
  const [formData, setFormData] = useState({
    inquiryType: "",
    name: "",
    content: ""
  });
  const [formResult, setFormResult] = useState("");
  const [openPopup, setOpenPopup] = useState<number | null>(null);

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.inquiryType && formData.name && formData.content) {
      setFormResult("success");
    } else {
      setFormResult("error");
    }
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const rectTop = targetElement.getBoundingClientRect().top;
      const offsetTop = window.pageYOffset;
      const top = rectTop + offsetTop;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  // Popup handlers
  const handlePopupOpen = (index: number) => {
    setOpenPopup(index);
  };

  const handlePopupClose = () => {
    setOpenPopup(null);
  };

  return (
    <main>
          <div id="top" className={styles.cTopSection}>
            <h1 className={`${styles.cTopSectionHeading} ${styles.jsScrollreveal}`}>
              <span className={styles.uTypingSize6}>Hello,</span>
              <span className={styles.uTypingSize12}>
                I'm <span className={styles.uColorRed}>Gac</span>kun.
              </span>
              <span className={styles.uTypingSize20}>Web Develop & Design.</span>
            </h1>
            <AnimatedSVG />
          </div>

          <section id="about" className={styles.cSection}>
            <h2 className={styles.cSectionHeading}>
              &gt; <span className={styles.uColorGreen}>.about</span>
              <span className={styles.uColorYellow}>()</span>
            </h2>
            <div className={styles.cSectionDescription}>
              私はウェブのフロントエンド開発者・デザイナーです。
              <br />
              HALを卒業後東京を拠点にフリーランス活動をしています。
              <br />
              主な活動内容はウェブサイトのデザインとコーディングで、特にWordPressのテーマ開発とSEOに特化したサイト制作が強みです。
              <br />
              また、アニメーションなどを駆使したクリエイティブな開発も行っています。
            </div>
            <h3 id="skill">Skill</h3>
            <div className={styles.cSkills}>
              <div className={styles.cSkillsItem}>
                <h4 className={styles.cSkillsHeading}>Main</h4>
                <ul className={styles.cSkillsList}>
                  <li className={styles.cSkillsListItem}>WordPress</li>
                  <li className={styles.cSkillsListItem}>SEO</li>
                  <li className={styles.cSkillsListItem}>UI/UX</li>
                </ul>
              </div>
              <div className={styles.cSkillsItem}>
                <h4 className={styles.cSkillsHeading}>Front end</h4>
                <ul className={styles.cSkillsList}>
                  <li className={styles.cSkillsListItem}>HTML5</li>
                  <li className={styles.cSkillsListItem}>CSS3</li>
                  <li className={styles.cSkillsListItem}>SASS</li>
                  <li className={styles.cSkillsListItem}>JavaScript(ES6)</li>
                  <li className={styles.cSkillsListItem}>JQuery</li>
                  <li className={styles.cSkillsListItem}>TypeScript</li>
                  <li className={styles.cSkillsListItem}>React.js</li>
                </ul>
              </div>
              <div className={styles.cSkillsItem}>
                <h4 className={styles.cSkillsHeading}>Back end</h4>
                <ul className={styles.cSkillsList}>
                  <li className={styles.cSkillsListItem}>MySQL</li>
                  <li className={styles.cSkillsListItem}>PHP</li>
                  <li className={styles.cSkillsListItem}>Node.js</li>
                </ul>
              </div>
              <div className={styles.cSkillsItem}>
                <h4 className={styles.cSkillsHeading}>Design tools</h4>
                <ul className={styles.cSkillsList}>
                  <li className={styles.cSkillsListItem}>Illustrator</li>
                  <li className={styles.cSkillsListItem}>Photoshop</li>
                  <li className={styles.cSkillsListItem}>XD</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="works" className={`${styles.cSection} ${styles.uPb40}`}>
            <h2 className={styles.cSectionHeading}>
              &gt; <span className={styles.uColorGreen}>.works</span>
              <span className={styles.uColorYellow}>('select')</span>
            </h2>
            <div className={styles.cSectionDescription}>
              私の制作実績です。
              <br />
              全て見るには<a href="#">一覧ページ</a>にアクセスしてください！
            </div>
          </section>

          <div className={styles.cWorks}>
            <article className={`${styles.cWorksItem} ${styles.jsReveal}`} onClick={() => handlePopupOpen(0)}>
              <a>
                <img src="/img/works01.jpg" alt="" className={styles.cWorksImg} />
                <span className={styles.cWorksCat}>web site</span>
                <h3 className={styles.cWorksHeading}>Labe</h3>
              </a>
            </article>
            <article className={`${styles.cWorksItem} ${styles.jsReveal}`} onClick={() => handlePopupOpen(1)}>
              <a>
                <img src="/img/works02.jpg" alt="" className={styles.cWorksImg} />
                <span className={styles.cWorksCat}>web site</span>
                <h3 className={styles.cWorksHeading}>HAL幼稚園</h3>
              </a>
            </article>
            <article className={`${styles.cWorksItem} ${styles.jsReveal}`} onClick={() => handlePopupOpen(2)}>
              <a>
                <img src="/img/works03.jpg" alt="" className={styles.cWorksImg} />
                <span className={styles.cWorksCat}>web site</span>
                <h3 className={styles.cWorksHeading}>越後妻有</h3>
              </a>
            </article>
            <article className={`${styles.cWorksItem} ${styles.jsReveal}`} onClick={() => handlePopupOpen(3)}>
              <a>
                <img src="/img/works04.png" alt="" className={styles.cWorksImg} />
                <span className={styles.cWorksCat}>web site</span>
                <h3 className={styles.cWorksHeading}>Studio Zero</h3>
              </a>
            </article>
            <article className={`${styles.cWorksItem} ${styles.jsReveal}`} onClick={() => handlePopupOpen(4)}>
              <a>
                <img src="/img/works05.png" alt="" className={styles.cWorksImg} />
                <span className={styles.cWorksCat}>web app</span>
                <h3 className={styles.cWorksHeading}>Group Work</h3>
              </a>
            </article>
          </div>

          {openPopup !== null && (
            <div className={`${styles.cWorksPopup} ${styles.jsPopupShow}`} onClick={handlePopupClose}>
              <div className={styles.cWorksPopupClose}></div>
              <div className={styles.cWorksPopupInner}>
                <img src={`/img/works0${openPopup + 1}_full.png`} alt="" />
              </div>
            </div>
          )}

          <a href="#" className={`${styles.cCodeButton} ${styles.uMb100} ${styles.jsReveal}`}>
            <span className={styles.cCodeButtonHead}>
              &lt;a href="/<span className={styles.cCodeButtonHovEffect}>works</span>/"&gt;
            </span>
            <p className={styles.cCodeButtonBody}>もっと見る</p>
            <span className={styles.cCodeButtonFoot}>&lt;/a&gt;</span>
          </a>

          <section id="blog" className={styles.cSection}>
            <h2 className={styles.cSectionHeading}>
              &gt; <span className={styles.uColorGreen}>.blog</span>
              <span className={styles.uColorYellow}>('desc')</span>
            </h2>
            <div className={styles.cSectionDescription}>
              私の技術ブログです。
              <br />
              主にWEBのフロントエンド開発についての記事を書いています。
            </div>
            <div className={`${styles.cBlog} ${styles.uMt70}`}>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_html.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>正しいタグを使用してセマンティクスなHTMLを書く</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_js.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>ES6を使いこなす 後編</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_js.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>ES6を使いこなす 前編</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_react.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>Reactのクラスコンポーネントを関数コンポーネントへ</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_design.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>フロントエンドエンジニアとしてのUX 後編</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
              <a href="#">
                <article className={styles.cBlogItem}>
                  <div className={styles.cBlogImg}>
                    <img src="/img/i_design.svg" alt="" />
                  </div>
                  <div className={styles.cBlogText}>
                    <h3 className={styles.cBlogHeading}>フロントエンドエンジニアとしてのUX 前編</h3>
                    <span className={styles.cBlogDate}>2022/02/01</span>
                  </div>
                </article>
              </a>
            </div>
            <a href="#" className={styles.cCodeButton}>
              <span className={styles.cCodeButtonHead}>
                &lt;a href="/<span className={styles.cCodeButtonHovEffect}>blog</span>/"&gt;
              </span>
              <p className={styles.cCodeButtonBody}>もっと見る</p>
              <span className={styles.cCodeButtonFoot}>&lt;/a&gt;</span>
            </a>
          </section>

          <section id="contact" className={styles.cSection}>
            <h2 className={styles.cSectionHeading}>
              &gt; <span className={styles.uColorGreen}>.contact</span>
              <span className={styles.uColorYellow}>(</span>message<span className={styles.uColorYellow}>)</span>
            </h2>
            <div className={styles.cSectionDescription}>制作のご依頼、ご相談などはこちらのフォームからお気軽にお問い合わせください。</div>
            <div className={styles.cContactArea}>
              <form onSubmit={handleSubmit} className={styles.cContactForm}>
                <div className={styles.cContactFormItem}>
                  <label htmlFor="inquiry_type" className={styles.cContactFormHeading}>
                    お問い合わせ目的
                  </label>
                  <select 
                    name="inquiry_type" 
                    id="inquiry_type"
                    value={formData.inquiryType}
                    onChange={(e) => handleInputChange("inquiryType", e.target.value)}
                  >
                    <option value="">- 選択してください -</option>
                    <option value="works">制作のご依頼</option>
                    <option value="consultation">お見積もり・ご相談</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className={styles.cContactFormItem}>
                  <label htmlFor="name" className={styles.cContactFormHeading}>
                    お名前
                  </label>
                  <input 
                    id="name" 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className={styles.cContactFormItem}>
                  <label htmlFor="content" className={styles.cContactFormHeading}>
                    お問い合わせ内容
                  </label>
                  <textarea 
                    id="content" 
                    name="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                  ></textarea>
                </div>
                <div className={styles.cCodeButton}>
                  <span className={styles.cCodeButtonHead}>
                    &lt;input type="<span className={styles.cCodeButtonHovEffect}>submit</span>" value="
                  </span>
                  <input type="submit" value="送信する" className={styles.cCodeButtonBody} />
                  <span className={styles.cCodeButtonFoot}>" /&gt;</span>
                </div>
              </form>
              <div className={styles.cContactAreaOutput}>
                <span className={styles.uColorBlue}>const</span> message <span className={styles.uColorRed}>=</span> <span className={styles.uColorYellow}>{"{"}</span>
                <br />
                <div className={styles.cContactAreaRow}>
                  inquaryType:{" "}
                  <span className={styles.uColorYellow}>
                    '{formData.inquiryType}'
                  </span>
                  ,
                </div>
                <div className={styles.cContactAreaRow}>
                  userName:{" "}
                  <span className={styles.uColorYellow}>
                    '{formData.name}'
                  </span>
                  ,
                </div>
                <div className={styles.cContactAreaRow}>
                  body:{" "}
                  <span className={styles.uColorYellow}>
                    '{formData.content}'
                  </span>
                </div>
                <span className={styles.uColorYellow}>{"}"}</span>
                <br />
                <br />
                gackun<span className={styles.uColorGreen}>.contact</span>
                <span className={styles.uColorYellow}>(</span>message<span className={styles.uColorYellow}>)</span>
                <br />
                <br />
                &gt; {formResult === "success" && (
                  <span className={styles.uColorGreen}>success!</span>
                )}
                {formResult === "error" && (
                  <span className={styles.uColorRed}>error! Please enter all of the items.</span>
                )}
              </div>
            </div>
          </section>
    </main>
  );
}
