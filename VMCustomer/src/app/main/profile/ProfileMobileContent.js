import { useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

import { useAuth } from "src/app/auth/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import ChangeEmailModal from "./ChangeEmailModal";
import ConfirmEmailModal from "./ConfirmEmailModal";
import { useTranslation } from "react-i18next";

import { showMessage } from "app/store/fuse/messageSlice";

const StyledProfileContainer = styled("div")(`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    width: 100%;
  `);

  const StyledBalanceBar = styled("div")(`
    width: 100%;
    height: 70px;
    background: #FCFEFF;
    box-shadow: 0px 1px 54.3px -10px rgba(0, 0, 0, 0.25);
    display: flex;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;

    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -2.2px;
  `);

  const StyledProfileInfo = styled("div")(`
    width: 100%;
    background: #FCFEFF;
    box-shadow: 0px 4px 16.5px 2px rgba(0, 0, 0, 0.25);
    padding: 24px 16px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .profile-btn {
      width: 100%;
      height: 47px;
      transform: rotate(-0.27deg);
      border-radius: 13.26px;
      background: #1C2E33;
      color: #FFF;
      text-align: center;
      font-family: Museo Sans;
      font-size: 20.497px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -1.273px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 66px;
      width: 100%;

      .profile-avatar {
        display: flex;
        align-items: center;
        gap: 262px;

        .profile-avatar-img {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 21px;

          img {
            width: 85.273px;
            height: 85.273px;
            transform: rotate(-0.27deg);
          }

          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -1.8px;
        }
      }

      .profile-info-detail {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 25px;
      
        .profile-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          width: 100%;

          div {
            color: #4D4D4D;
            text-align: center;
            font-family: Museo Sans;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -2.069px;
          }

          .info-text {
            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -2.069px;
            margin-right: auto;
          }
        }
      }
    }
  `);

  const StyledUpdateButton = styled(motion.button)(({ theme }) => ({
    display: "flex",
    padding: "15px 26px",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: "30px",
    gap: "10px",
    borderRadius: "15px",
    border: "1px solid #000",
    background: "#1C2E33",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-1.44px",
    cursor: "pointer",
  }));
  
  const hoverAnimation = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
    backgroundColor: "#536A71",
    borderColor: "#536A71",
    transition: { duration: 0.2 }
  };
  
  const tapAnimation = {
    scale: 1.05
  };

  const StyledDeleteAccountButton = styled(motion.button)(({ theme }) => ({
    display: "flex",
    padding: "15px 26px",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: "30px",
    gap: "10px",
    borderRadius: "15px",
    border: "1px solid #dcf8fb",
    background: "rgb(200 34 34)",
    color: "white",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-1.44px",
    cursor: "pointer",
  }));
  
  const hoverDeleteAccountBtnAnimation = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
    backgroundColor: "rgb(220 54 54)",
    borderColor: "rgb(210 44 44)",
    transition: { duration: 0.2 }
  };
  
  const StyledEditProfileItemButton = styled("div")(`
    & img {
      transition: all 0.3s ease;
      width: 28px;
    }
  
    & img:hover {
      fill: #f00; 
      transform: scale(1.1);
    }
  
    & img:active {
      fill: #f00; 
      transform: scale(1.2);
    }
  `);

function ProfileContent(props) {
  const { t } = useTranslation("ProfilePage");
  const dispatch = useDispatch();
  const { name, email } = useAuth();

  const [onUpdateStage, setOnUpdateStage] = useState(false);

  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passChanged, setPassChanged] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  const [confirmEmailModalOpened, setConfirmEmailModalOpened] = useState(false);

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState('');

  const { userBalance, updateProfile } = props;

  const onUpdateProfileClicked = () => {
    if (!onUpdateStage) {
      setOnUpdateStage(true);
    } else {
      if (!usernameChanged && !passChanged && !emailChanged) {
        dispatch(
          showMessage({
              message: `${t('Change_MSG')}`,
              variant: 'warning'
          }));
      } else {
        updateProfile(newName, currentPass, newPass, newEmail);
      }
    }
  }

  return (
    <StyledProfileContainer>
      <StyledBalanceBar>
        <div>{t("Balance")}</div>
        <div>${userBalance}</div>
      </StyledBalanceBar>
      <StyledProfileInfo>
        <div className="profile-info">
          {/* <div className="profile-avatar">
            <div className="profile-avatar-img">
              <img src="assets/images/avatars/avatar.png" alt="avatar" />
              <div>{t("Change_Avatar")}</div>
            </div>
          </div> */}
          <div className="profile-info-detail">
            <ChangePasswordModal
              open={passwordModalOpen}
              onClose={() => setPasswordModalOpen(false)}
              setCurrentPass={setCurrentPass}
              setNewPass={setNewPass}
              setPassChanged={setPassChanged}
            />
            <ChangeUsernameModal
              open={usernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
              currentName={name}
              setNewName={setNewName}
              setUsernameChanged={setUsernameChanged}
            />
            <ChangeEmailModal
              open={emailModalOpen}
              onClose={() => setEmailModalOpen(false)}
              currentEmail={email}
              setNewEmail={setNewEmail}
              setEmailChanged={setEmailChanged}
            />
            <ConfirmEmailModal
              open={confirmEmailModalOpened}
              onClose={() => setConfirmEmailModalOpened(false)}
              currentEmail={email}
            />
            <div className="profile-info-item">
              <div>{t("UserName")}{usernameChanged ? "*" : ""}: </div>
              <div className="info-text">{newName}</div>
              {onUpdateStage ?
                <StyledEditProfileItemButton
                  onClick={() => setUsernameModalOpen(true)}
                >
                  <img src="assets/images/profile/edit_profile_item.svg" alt="Edit Username" />
                </StyledEditProfileItemButton>
                :
                null}
            </div>
            <div className="profile-info-item">
              <div>{t("Password")}{passChanged ? "*" : ""}: </div>
              <div className="info-text">********</div>
              {onUpdateStage ?
                <StyledEditProfileItemButton
                  onClick={() => setPasswordModalOpen(true)}
                >
                  <img src="assets/images/profile/edit_profile_item.svg" alt="Edit Password" />
                </StyledEditProfileItemButton>
                :
                null}
            </div>
            <div className="profile-info-item">
              <div>{t("Email")}{emailChanged ? "*" : ""}: </div>
              <div className="info-text">{newEmail.length > 15 ? 
                      newEmail.slice(0, 7) + '***' + newEmail.slice(-7) : newEmail}</div>
              {onUpdateStage ?
                <StyledEditProfileItemButton
                  onClick={() => setEmailModalOpen(true)}
                >
                  <img src="assets/images/profile/edit_profile_item.svg" alt="Edit Email" />
                </StyledEditProfileItemButton>
                :
                null}
            </div>
          </div>
        </div>
        <StyledUpdateButton
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          onClick={onUpdateProfileClicked}
        >
          {!onUpdateStage ? `${t("Update")}` : `${t("Save")}`}
        </StyledUpdateButton>
        {!onUpdateStage ?
          <StyledDeleteAccountButton
            whileHover={hoverDeleteAccountBtnAnimation}
            whileTap={tapAnimation}
            onClick={() => setConfirmEmailModalOpened(true)}
          >
            {t("Delete")}
          </StyledDeleteAccountButton>
          :
          null}
      </StyledProfileInfo>
    </StyledProfileContainer>
  );
}

export default ProfileContent;
