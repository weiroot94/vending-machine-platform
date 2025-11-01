import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { useRef, useEffect } from "react";
import appConfig from "app/configs/appConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {motion} from "framer-motion";

function HomeMobileContent(props) {
  const StyledMobileHomeContainer = styled("div")(`
    width: 100%;
    background: #E2F9FF;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  `);
  const StyledMobileFeaturedProductContainer = styled("div")(`
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`);
  const StyledMobileTitle = styled("div")(`
    color: #000;
    text-align: center;
    font-family: Inter var;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -2.4px;
`);

  const StyledMobileFeaturedProduct = styled("div")(`
    padding: 2px;
  `);

  const StyledMobileFeaturedProductContent = styled("div")(`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-top-left-radius: 10.68px;
    border-top-right-radius: 10.68px;
    background: radial-gradient(50.03% 50% at 24.79% 50%, #FF84C1 0%, #D971A4 100%);
    height: 200px;
    width: 100%;
    justify-content: center;
`);
  const StyledMobilePopularProductContainer = styled("div")(`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    width: 100%;
`);
  const StyledMobilePopularProductList = styled("div")(`
    display: flex;
    align-items: flex-start;
    gap: 25px;
    width: 100%;
`);
  const StyledMobilePopularProductItem = styled("div")(`
    height: 160px;
    width: 100%;
    border-radius: 10px;
    background: radial-gradient(50% 50% at 50% 50%, #7FD342 0%, #449542 98.96%);
    box-shadow: 0px 9px 29.1px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;

    .info-container {
      display: flex;
      gap: 10px;
      width: 60%;
      flex-direction: column;
      justify-content: flex-start;
    }
`);
  const StyledMobilePopularProductItemDescription = styled("div")(`
    color: #FFF;
    font-family: Museo Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: -0.88px;
  `);

  const StyledMobilePopularProductItemTitle = styled("div")(`
    color: #000;
    font-family: Inter var;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -1.36px;
  `);

  const StyledViewPopularItemButton = styled(motion.button)(({ theme }) => ({
    width: "100px",
    padding: "5px 8px",
    borderRadius: "5px",
    background: "#1C2E33",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "12px",
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

  const StyledPopCategory = styled("p")(`
    position: absolute;
    bottom: 0px;
    background: #E9E8EE;
    color: #000;
    width: 100%;
    padding: 3px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    text-transform: capitalize;
    font-size: 10px;
  `)

  const StyledCategory = styled("div")(`
    color: white;
    width: 100%;
    padding: 2px;
    text-align: center;
    text-transform: capitalize;
    font-size: 12px;
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

  const StyledMobileFeaturedProductInfo = styled("div")(`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    gap: 8px;
    width: 64%;
    margin-right: -8%;

    .product-title {
      color: #FFF;
      text-align: center;
      font-family: Inter var;
      font-size: 22px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .product-description {
      color: #FFF;
      text-align: center;
      font-family: Museo Sans;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
`);

const StyledMobileCheckOutButton = styled(motion.button)(({ theme }) => ({
  padding: "5.768px 25.441px",
  borderRadius: "5px",
  background: "#FFF",
  color: "#1C2B33",
  textAlign: "center",
  fontFamily: "Inter var",
  fontSize: "15.04px",  
  fontStyle: "normal",
  fontWeight: "800",
  lineHeight: "normal",
  marginLeft: "auto",
}));

const StyledSlider = styled(Slider)`
  box-shadow: 0px 21.748px 15.382px -13.864px rgba(0, 0, 0, 0.25);
  border-radius: 39px;

  .slick-dots {
    bottom: -50px !important;
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
  const { style, onClick } = props;
  return (
    <div
        className={`next-arrow-btn`}
        onClick={onClick}>
        <img src="assets/images/slideview/slide-arrow.png" alt="Next"
          style={{ ...style,
            position: "absolute",
            right: "-14px",
            top: "48%",
            paddingBottom: "0px",
            width: "40px",
            transform: "scaleX(-1)",
          }}/>
    </div>
  );
}

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <div
        className="prev-arrow-btn"
        style={{zIndex: "10"}}
        onClick={onClick}>
          <img src="assets/images/slideview/slide-arrow.png" alt="Next"
            style={{ ...style,
            position: "absolute",
            left: "-16px",
            top: "48%",
            width: "40px",
            zIndex: "10",
            paddingBottom: "30px",
          }}/>
    </div>
  );
}

  const {t} = useTranslation("homePage");
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  let sliderRef = useRef(null);
  const {FeaturedProduct, PopularProduct} = props;

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
          marginBottom: "30px"
        }}
      >
        <ul style={{ margin: "0px", transform: "scale(1.3)" }}> {dots} </ul>
      </div>
    ),
  };

  const productCategoryMap = {
    "ecig": `${t('ECig')}`,
    "snack": `${t('Snacks')}`,
    "drink": `${t('Drink')}`,
  }

  const onClickProductItem = (product_id) => {
    navigate("/product/detail/" + product_id);
  };

  useEffect(() => {
    sliderRef.slickPlay();
  }, [sliderRef]);

  return (
    <StyledMobileHomeContainer>
      <StyledMobileFeaturedProductContainer>
        <StyledMobileTitle>{t('Featured')}</StyledMobileTitle>
        <StyledSlider ref={slider => (sliderRef = slider)} {...settings}>
          {FeaturedProduct &&
            FeaturedProduct.map((product) => (
              <StyledMobileFeaturedProduct key={product._id} className="relative">
                <StyledMobileFeaturedProductContent>
                  <img
                    src={`${appConfig.API_SERVER}file/download/${btoa(
                      product.thumbnail
                    )}`}
                    alt="product"
                    style={{
                      width: "auto",
                      height: "150px",
                    }}
                  />
                  <StyledMobileFeaturedProductInfo>
                    <div className="product-title">{i18n.language == "en"? product.name: product.name_de}</div>
                    <div className="product-description">
                      {
                        (i18n.language == "en") ? 
                          product.description.length > 120 ? 
                          product.description.slice(0, 120) + '...' : product.description                          
                         : 
                          product.description_de.length > 120 ? 
                          product.description_de.slice(0, 120) + '...' : product.description_de                          
                      }
                    </div>
                    <StyledMobileCheckOutButton
                      whileHover={{
                        borderRadius: "50%",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={tapAnimation}
                      onClick={() => onClickProductItem(product._id)}
                    >
                      {t('Detail')}
                    </StyledMobileCheckOutButton>
                  </StyledMobileFeaturedProductInfo>
                </StyledMobileFeaturedProductContent>
                <StyledCategory>
                  <div className="gradient-border"></div>
                  {productCategoryMap[product.category]}
                </StyledCategory>
              </StyledMobileFeaturedProduct>
            ))}
        </StyledSlider>
      </StyledMobileFeaturedProductContainer>
      <StyledMobilePopularProductContainer>
        <StyledMobileTitle>{t('Popular')}</StyledMobileTitle>
        <StyledMobilePopularProductList className="flex flex-col">
          {PopularProduct &&
            PopularProduct.map((product) => (
              <StyledMobilePopularProductItem key={product._id}>
                <StyledPopCategory>{productCategoryMap[product.category]}</StyledPopCategory>
                <img
                  src={`${appConfig.API_SERVER}file/download/${btoa(
                    product.thumbnail
                  )}`}
                  alt="product"
                  style={{
                    width: "auto",
                    height: "100px",
                    marginLeft: "30px",
                    marginRight: "30px",
                  }}
                />
                <div className="info-container">
                  <StyledMobilePopularProductItemTitle>
                    {i18n.language == "en"? product.name: product.name_de}
                  </StyledMobilePopularProductItemTitle>
                  <StyledMobilePopularProductItemDescription>
                    {
                      (i18n.language == "en") ? 
                        product.description.length > 47 ? 
                        product.description.slice(0, 47) + '...' : product.description                          
                        : 
                        product.description_de.length > 47 ? 
                        product.description_de.slice(0, 47) + '...' : product.description_de                          
                    }
                  </StyledMobilePopularProductItemDescription>
                  <StyledViewPopularItemButton
                    whileHover={hoverAnimation}
                    whileTap={tapAnimation}
                    onClick={() => onClickProductItem(product._id)}
                  >
                    {t('Detail')}
                  </StyledViewPopularItemButton>
                </div>
              </StyledMobilePopularProductItem>
            ))}
        </StyledMobilePopularProductList>
      </StyledMobilePopularProductContainer>
    </StyledMobileHomeContainer>
  );
}

export default HomeMobileContent;
