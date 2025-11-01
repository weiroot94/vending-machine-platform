import {useState} from "react";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import appConfig from "app/configs/appConfig";
import MapComponent from "./MapComponent";

const StyledMapContainer = styled("div")(`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-shrink: 0;
    width: 95%;
  `);

  const StyledMapSearchBox = styled("div")(`
    width: 100%;
    display: flex;
    height: 61px;
    margin-top: 50px;
    padding: 0px 15px;
    align-items: center;
    gap: 17px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.90);
    box-shadow: 0px 3px 3.9px 0px rgba(0, 0, 0, 0.25);

    .divider {
      width: 1px;
      height: 61px;
      background: #999;
    }

    input {
      color: #999;
      text-align: center;
      font-family: Inter var;
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
      text-align: left;
      width: 100%;
      border: 0px;
      outline: none;

      &:hover {
        border: 0px;
        outline: none;
      }

      &:focus {
        border: 0px;
        outline: none;
      }
    }
  `);

  const StyledContentDiv = styled("p")(`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 15px;
  `)

  const StyledGoogleMap = styled("div")(`
    display: flex;
    height: 894px;
    width: 50%;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .title {
      color: #142024;
      font-family: Inter var;
      font-size: 42px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -1.68px;
    }
  `);

  const StyledCategory = styled("p")(`
    position: absolute;
    right: 0px;
    background: #E9E8EE;
    color: #000;
    height: 100%;
    padding: 5px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    text-align: center;
    text-transform: capitalize;
    font-size: 14px;
    transform: rotate(180deg);
    writing-mode: vertical-lr;
  `)

  const StyledProductList = styled("div")(`
    display: flex;
    width: 50%;
    height: 910px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .title {
      color: #142024;
      font-family: Inter var;
      font-size: 42px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -1.68px;
    }

    .product-list {
      display: flex;
      padding: 10px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 20px;
      flex: 1 0 0;
      align-self: stretch;
      overflow-y: scroll;
      overflow-x: hidden;

      .product-item {
        width: 100%;
        height: 150px;
        flex-shrink: 0;
        border-radius: 10px;
        background: #FBFEFF;
        box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: start;
        flex-direction: row;
        cursor: pointer;


        &:hover {
          background: lightgrey;
        }

        .product-img {
          width: 142px;
          height: 150px;
          flex-shrink: 0;
          background: #142024;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            height: 120px;
            width: auto;
          }
        }

        .product-description {
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-size: 30px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -1.2px;

          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          width: 100%;
        }
      }
    }
  `);

function MapContent(props) {
  const {t} = useTranslation("MapPage");
  const {i18n} = useTranslation();
  const {Machines, Product, Specified} = props;

  const [search, setSearch] = useState(Specified?.name ? Specified.name : "");

  const filteredProducts = search
  ? Product.filter((product) =>
      i18n.language == "en"
      ? product.name.toLowerCase().includes(search.toLowerCase())
      : product.name_de.toLowerCase().includes(search.toLowerCase())
    )
  : Product;

  const productCategoryMap = {
    "ecig": `${t('ECig')}`,
    "snack": `${t('Snacks')}`,
    "drink": `${t('Drink')}`,
  }

  const filteredMachines = [];

  if (Specified?.id)  {
    for (const machine of Machines) {
      for (const product of machine.product_list) {
        if (product.type == Specified.id) {
          filteredMachines.push(machine);
          break;
        }
      }
    }
  }

  const [machineList, setMachineList] = useState(filteredMachines.length > 0 ? filteredMachines: Machines);

  const onSearchChanged = (event) => {
    setSearch(event.target.value);
  };

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

  return (
    <StyledMapContainer>
      <StyledMapSearchBox>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="31"
          viewBox="0 0 30 31"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.9032 21.232C14.3336 24.8918 7.64473 24.6038 3.40877 20.3678C-1.13626 15.8228 -1.13626 8.45381 3.40877 3.90878C7.9538 -0.636259 15.3228 -0.636258 19.8678 3.90878C24.1037 8.14473 24.3918 14.8336 20.732 19.4032L29.6212 28.2925C30.1262 28.7975 30.1262 29.6162 29.6212 30.1212C29.1162 30.6262 28.2975 30.6262 27.7925 30.1212L18.9032 21.232ZM5.23755 18.539C1.70253 15.004 1.70253 9.27258 5.23755 5.73756C8.77258 2.20253 14.504 2.20253 18.039 5.73756C21.5714 9.26999 21.574 14.9956 18.0468 18.5312C18.0442 18.5338 18.0416 18.5364 18.039 18.539C18.0364 18.5416 18.0338 18.5442 18.0312 18.5468C14.4956 22.074 8.76999 22.0714 5.23755 18.539Z"
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
      <StyledContentDiv>
        <StyledGoogleMap>
          <div className="title">{t("Store")}</div>
          <div style={{width: "100%", height: "100%"}}>
            <MapComponent machines={machineList} />
          </div>
        </StyledGoogleMap>
        <StyledProductList>
          <div className="title">{t("Product")}</div>
          <div className="product-list">
            {filteredProducts &&
              filteredProducts.map((product_item) => (
                <div
                  className="product-item relative"
                  key={product_item._id}
                  onClick={() => onClickProductItem(product_item._id)}
                >
                  <StyledCategory>{productCategoryMap[product_item.category]}</StyledCategory>
                  <div className="product-img">
                    <img
                      src={`${appConfig.API_SERVER}file/download/${btoa(
                        product_item.thumbnail
                      )}`}
                      alt={t("Product")}
                    />
                  </div>
                  <div className="product-description">
                    <div>{i18n.language == "en"? product_item.name: product_item.name_de}</div>
                  </div>
                </div>
              ))}
          </div>
        </StyledProductList>
      </StyledContentDiv>
    </StyledMapContainer>
  );
}

export default MapContent;
