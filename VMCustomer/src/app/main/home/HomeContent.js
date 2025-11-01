import {Hidden} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { useRef, useEffect } from "react";
import appConfig from "app/configs/appConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {motion} from "framer-motion";

function HomeContent(props) {
  const StyledHomeContainer = styled("div")(`
    width: 100%;
    background: #E2F9FF;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    margin-bottom: 88px;
  `);
  const StyledFeaturedProductContainer = styled("div")(`
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;;
    width: 100%;
    gap: 15px;
  `);
  const StyledTitle = styled("div")(`
    color: #000;
    margin-right: auto;
    font-family: Inter var;
    font-size: 50px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -2.4px;
    margin-top: 40px;
  `);

  const StyledFeaturedProduct = styled("div")(`
    padding: 2px;
  `);

  const StyledFeaturedProductContent = styled("div")(`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8%;
    border-top-left-radius: 10.68px;
    border-top-right-radius: 10.68px;
    background: radial-gradient(50.03% 50% at 24.79% 50%, #FF84C1 0%, #D971A4 100%);
    height: 581px;
    width: 100%;
    justify-content: center;
  `);

  const StyledPopularProductContainer = styled("div")(`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    width: 100%;
    margin-bottom: -23px;
  `);

  const StyledPopularProductList = styled("div")(`
    display: flex;
    align-items: flex-start;
    gap: 25px;
  `);

  const StyledPopularProductItem = styled("div")(`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .product-content {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 3%;
      width: 100%;
      height: 252px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background: radial-gradient(50% 50% at 50% 50%, #7FD342 0%, #449542 98.96%);
  
      .info-container {
        display: flex;
        gap: 20px;
        width: 65%;
        flex-direction: column;
        justify-content: flex-start;
  
        .product-title {
          color: #000;
          font-family: Inter var;
          font-size: 34px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
  
        .product-description {
          color: #FFF;
          font-family: Museo Sans;
          font-size: 22px;
          font-style: normal;
          font-weight: 300;
          line-height: normal;
          letter-spacing: -0.88px;
          max-height: 50px;
          overflow: hidden;
        }
     }
    }
  `);

  const StyledViewPopularItemButton = styled(motion.button)(({ theme }) => ({
    width: "140px",
    padding: "12px 4px",
    borderRadius: "10px",
    background: "#1C2E33",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-0.88px",
    cursor: "pointer",
  }));

  const hoverAnimation = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
    backgroundColor: "#375760",
    borderColor: "#375760",
    transition: { duration: 0.2 }
  };
  
  const tapAnimation = {
    scale: 1.05
  };

  const StyledCategory = styled("div")(`
    color: white;
    width: 100%;
    padding: 5px;
    text-align: center;
    text-transform: capitalize;
    font-size: 20px;
    background: #E9E8EE;
    position: relative;
    display: inline-block;
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    border-bottom-right-radius: 10.68px;
    border-bottom-left-radius: 10.68px;

    .gradient-border {
      background: linear-gradient(180deg, #ededed 30%, #cbcaca 100%);
      position: absolute;
      top: 0px;
      left: -1.3px;
      right: -1.3px;
      bottom: -2px;
      z-index: -1;
      border-bottom-right-radius: 10.68px;
      border-bottom-left-radius: 10.68px;
    }
  `)

  const StyledPopCategory = styled("p")(`
    background: #E9E8EE;
    position: relative;
    display: inline-block;
    color: #000;
    width: 100%;
    padding: 3px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    text-transform: capitalize;
    font-size: 12px;

    .gradient-border {
      background: linear-gradient(180deg, #ededed 30%, #cbcaca 100%);
      position: absolute;
      top: 0px;
      left: -1.3px;
      right: -1.3px;
      bottom: -2px;
      z-index: -1;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }
  `)

  const StyledFeaturedProductInfo = styled("div")(`
    display: flex;
    justify-content: center;
    gap: 55px;
    flex-direction: column;
    width: 58%;
    margin-right: -8%;

    .product-title {
      color: #FFF;
      text-align: center;
      font-family: Inter var;
      font-size: 80px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 2.5px;
    }

    .product-description {
      color: #FFF;
      text-align: center;
      font-family: Museo Sans;
      font-size: 33px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  `);

  const StyledCheckOutButton = styled(motion.button)(({ theme }) => ({
    padding: "27.768px 85.441px",
    borderRadius: "21.36px",
    background: "#FFF",
    textAlign: "center",
    fontFamily: "Inter var",
    fontSize: "32.04px",
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: "normal",
    marginLeft: "auto",
  }));

  const checkoutBtnHoverAnimation = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
    color: "#D91173",
    backgroundColor: "#FFE5F9",
    transition: { duration: 0.2 }
  };

  const StyledSlider = styled(Slider)`
    box-shadow: 0px 21.748px 15.382px -13.864px rgba(0, 0, 0, 0.25);
    border-radius: 39px;

    .slick-dots {
      bottom: -80px !important;
    }

    .slick-dots li button:before {
      color: darkgrey;
    }

    .slick-dots li {
      margin: 0px -4px;
    }

    .slick-dots li.slick-active button:before {
      color: black;
    }

    .slick-list {
      position: relative;
    }
  `;

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}>
        <img src="assets/images/slideview/slide-arrow.png" alt="Next"
          style={{ ...style,
            position: "absolute",
            right: "23px",
            top: "50%",
            transform: "scale(5) scaleX(-1)",
          }}/>
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{zIndex: "10"}}
        onClick={onClick}>
          <img src="assets/images/slideview/slide-arrow.png" alt="Next"
            style={{ ...style,
            position: "absolute",
            left: "23px",
            transform: "scale(5)",
          }}/>   
      </div>
    );
  }

  const {t} = useTranslation("homePage");
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const {FeaturedProduct, PopularProduct} = props;
  let sliderRef = useRef(null);

  const productCategoryMap = {
    "ecig": `${t('ECig')}`,
    "snack": `${t('Snacks')}`,
    "drink": `${t('Drink')}`,
  }

  const settings = {
    dots: true,
    infinite: FeaturedProduct.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    waitForAnimate: false,
    className: "slider-products",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div
        style={{
          borderRadius: "10px",
          padding: "2px",
          marginBottom: "45px"
        }}
      >
        <ul style={{ margin: "0px", transform: "scale(3)" }}> {dots} </ul>
      </div>
    ),
  };
  const onClickProductItem = (product_id) => {
    navigate("/product/detail/" + product_id);
  };

  useEffect(() => {
    sliderRef.slickPlay();
  }, [sliderRef]);

  return (
    <StyledHomeContainer>
      <StyledFeaturedProductContainer>
        <StyledTitle>{t('Featured')}</StyledTitle>
        <StyledSlider ref={slider => (sliderRef = slider)} {...settings}>
          {FeaturedProduct &&
            FeaturedProduct.map((product) => (
              <StyledFeaturedProduct key={product._id} className="relative">
                <StyledFeaturedProductContent>
                  <img
                    src={`${appConfig.API_SERVER}file/download/${btoa(
                      product.thumbnail
                    )}`}
                    alt="product"
                    style={{width: "auto", height: "465.654px"}}
                  />
                  <StyledFeaturedProductInfo>
                    <div className="product-title">{i18n.language == "en"? product.name: product.name_de}</div>
                    <div className="product-description">
                      {
                        (i18n.language == "en") ? 
                          product.description.length > 250 ? 
                          product.description.slice(0, 250) + '...' : product.description                          
                         : 
                          product.description_de.length > 250 ? 
                          product.description_de.slice(0, 250) + '...' : product.description_de                          
                      }
                    </div>
                    <StyledCheckOutButton
                      whileHover={checkoutBtnHoverAnimation}
                      whileTap={tapAnimation}
                      onClick={() => onClickProductItem(product._id)}
                    >
                      {t('Detail')}
                    </StyledCheckOutButton>
                  </StyledFeaturedProductInfo>
                </StyledFeaturedProductContent>
                <StyledCategory>
                  <div className="gradient-border"></div>
                  {productCategoryMap[product.category]}
                </StyledCategory>
              </StyledFeaturedProduct>
            ))}
        </StyledSlider>
      </StyledFeaturedProductContainer>
      <StyledPopularProductContainer>
        <StyledTitle>{t('Popular')}</StyledTitle>
        <StyledPopularProductList>
          {PopularProduct &&
            PopularProduct.map((product) => (
              <StyledPopularProductItem key={product._id}>
                <div className="product-content">
                  <img
                    src={`${appConfig.API_SERVER}file/download/${btoa(
                      product.thumbnail
                    )}`}
                    alt="product"
                    style={{width: "auto", height: "193.14px", padding: "10px"}}
                  />
                  <div className="info-container">
                    <div className="product-title">
                      {i18n.language == "en"? product.name: product.name_de}
                    </div>
                    <div className="product-description">
                      {
                        (i18n.language == "en") ? 
                          product.description.length > 50 ? 
                          product.description.slice(0, 55) + '...' : product.description                          
                          : 
                          product.description_de.length > 50 ? 
                          product.description_de.slice(0, 55) + '...' : product.description_de                          
                      }
                    </div>
                    <StyledViewPopularItemButton
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                      onClick={() => onClickProductItem(product._id)}
                    >
                      {t('Detail')}
                    </StyledViewPopularItemButton>
                  </div>
                </div>
                <StyledPopCategory>
                  <div className="gradient-border"></div>
                  {productCategoryMap[product.category]}
                </StyledPopCategory>
              </StyledPopularProductItem>
            ))}
        </StyledPopularProductList>
      </StyledPopularProductContainer>
    </StyledHomeContainer>
  );
}

export default HomeContent;
