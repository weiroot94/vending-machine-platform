import Slider from "react-slick";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import appConfig from "app/configs/appConfig";
import MapComponent from "./MapComponent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledMapContainer = styled("div")(`
    display: inline-flex;
    padding: 5px;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    width: 100%;
  `);

const StyledMapSearchBox = styled("div")(`
    border-radius: 5.037px;
    background: rgba(255, 255, 255, 0.90);
    box-shadow: 0px 2px 2.9px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    padding: 0px 8px;
    align-items: center;
    gap: 9.5px;
    align-self: stretch;
    width: 100%;

    .search-input {
      color: #999;
      text-align: left;
      font-family: Museo Sans;
      font-size: 16.789px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
      width: 100%;
    }

    div {
      width: 0.56px;
      height: 34.138px;
      background: #999;
    }
  `);

const StyledGoogleMap = styled("div")(`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .title {
      color: #142024;
      font-family: Inter var;
      font-size: 30px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -1.68px;
    }
  `);

const StyledCategory = styled("p")(`
    position: absolute;
    right: 0px;
    bottom: -1px;
    background: #E9E8EE;
    color: #000;
    width: 100%;
    padding: 1px !important;
    border-bottom-right-radius: 5px;
    text-align: center;
    text-transform: capitalize;
    font-size: 8px;
  `)

const StyledProductList = styled("div")(`
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
    background: #70ACCC;
    width: 100%;

    .title {
      color: #142024;
      font-family: Inter var;
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -1.68px;
    }

    .product-list {
      width: 100%;
      display: flex;
      padding: 10px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex: 1 0 0;
      align-self: stretch;
    
      .product-item {
        border-radius: 4.733px;
        background: linear-gradient(180deg, #FBFEFF 0%, rgba(251, 254, 255, 0.50) 100%);
        box-shadow: 0px 9.467px 18.933px 0px rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(4.733333110809326px);
        height: 71px;
        flex-shrink: 0;
        display: flex;
        margin-right: 20px;

        .product-img {
          width: 67.213px;
          height: 71px;
          flex-shrink: 0;
          background: #142024;
          border-top-left-radius: 4.733px;
          border-bottom-left-radius: 4.733px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            height: 60px;
            width: auto;
          }
        }

        .product-description {
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -1.2px;
          font-size: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          width: 100%;
        }
      }
    }
  `);

function MapMobileContent(props) {
  const { t } = useTranslation("MapPage");
  const { i18n } = useTranslation();
  const { Machines, Product, Specified } = props;

  console.log({ Product });

  const [search, setSearch] = useState(Specified?.name ? Specified.name : "");

  const filteredProducts = search
    ? Product.filter((product) =>
      i18n.language == "en" 
      ? product.name.toLowerCase().includes(search.toLowerCase())
      : product.name_de.toLowerCase().includes(search.toLowerCase())
    )
    : Product;

  const settings = {
    infinite: false,
    speed: 500,
    centerMode: true,
    centerPadding: "40px",
    className: "slider-products center",
    arrows: false,
  };

  const filteredMachines = [];

  const productCategoryMap = {
    "ecig": `${t('ECig')}`,
    "snack": `${t('Snacks')}`,
    "drink": `${t('Drink')}`,
  }

  if (Specified?.id) {
    for (const machine of Machines) {
      for (const product of machine.product_list) {
        if (product.type == Specified.id) {
          filteredMachines.push(machine);
          break;
        }
      }
    }
  }

  const [machineList, setMachineList] = useState(filteredMachines.length > 0 ? filteredMachines : Machines);

  const onClickProductItem = (product_id) => {
    const filteredMachines = [];
    for (const machine of Machines) {
      for (const product of machine.product_list) {
        if (product.type == product_id) {
          filteredMachines.push(machine);
          break;
        }
      }
    }

    setMachineList(filteredMachines);
  };

  const onSearchChanged = (event) => {
    setSearch(event.target.value);
  };

  return (
    <StyledMapContainer>
      <StyledMapSearchBox>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.2472 12.2767C8.68987 14.3249 4.94651 14.1637 2.5759 11.7931C0.0323184 9.24954 0.0323184 5.12558 2.5759 2.582C5.11947 0.0384213 9.24343 0.0384218 11.787 2.582C14.1576 4.95261 14.3188 8.69596 12.2706 11.2533L17.2454 16.2281C17.528 16.5107 17.528 16.9689 17.2454 17.2515C16.9628 17.5342 16.5046 17.5342 16.222 17.2515L11.2472 12.2767ZM3.59935 10.7697C1.62101 8.79132 1.62101 5.5838 3.59935 3.60546C5.57769 1.62712 8.78521 1.62712 10.7636 3.60546C12.7404 5.58235 12.7419 8.78661 10.7679 10.7653C10.7664 10.7667 10.765 10.7682 10.7635 10.7696C10.7621 10.7711 10.7606 10.7725 10.7592 10.774C8.78051 12.748 5.57624 12.7465 3.59935 10.7697Z"
            fill="#1A1A1A"
          />
        </svg>
        <div className="divider" />
        <input
          placeholder={t("Search")}
          value={search}
          onChange={onSearchChanged}
        />
      </StyledMapSearchBox>
      <div className="flex flex-col justify-center items-center w-full">
        <StyledGoogleMap>
          <div className="title">{t("Store")}</div>
          <div style={{ width: "100%", height: "350px" }}>
            <MapComponent machines={machineList} />
          </div>
        </StyledGoogleMap>
        {filteredProducts.length > 0 ? <StyledProductList>
          <div className="title">{t("Product")}</div>
          <div className="product-list slider-container">
            <Slider {...settings}>
              {filteredProducts.map((product_item) => (
                <div key={product_item._id}>
                  <div
                    className="product-item"
                    key={product_item._id}
                    onClick={() => onClickProductItem(product_item._id)}
                  >

                    <div className="product-img">
                      <img
                        src={`${appConfig.API_SERVER}file/download/${btoa(
                          product_item.thumbnail
                        )}`}
                        alt={t("Product")}
                      />
                    </div>
                    <div className="product-description relative">
                      <StyledCategory>{productCategoryMap[product_item.category]}</StyledCategory>
                      <div>{i18n.language == "en" ? product_item.name : product_item.name_de}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </StyledProductList> : <StyledProductList>
          <div className="title">{t("No_Match")}</div>
        </StyledProductList>}
      </div>
    </StyledMapContainer>
  );
}

export default MapMobileContent;
