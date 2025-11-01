import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useAuth } from 'src/app/auth/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import appConfig from 'app/configs/appConfig';
import { useTranslation } from 'react-i18next';

import { showMessage } from 'app/store/fuse/messageSlice';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 30%; /* Default width for desktop */
    background: #e2f9ff;
  }

  @media (max-width: 600px) {
    .MuiDialog-paper {
      width: 80%; /* Width for mobile devices */
    }
  }

  .MuiDialogTitle-root {
    display: flex;
    justify-content: flex-start;
    margin-top: 24px;
    font-family: "Inter var";
    font-size: 22px;
  }

  .closeButton {
    position: absolute;
    font-size: 25px;
    font-style: bold;
    top: 5px;
    right: 16px;
    margin: 0;
    cursor: pointer;
  }

  .MuiDialogContent-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .MuiDialogActions-root {
    display: flex;
    justify-content: center;
  }

  .inputContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    font-size: 18px;
    font-family: "Museo Sans";
    gap: 8px;

    input {
      width: 100%;
      height: 30px;
    }
  }
`;

const StyledSaveButton = styled(motion.button)(({ theme }) => ({
    display: "flex",
    padding: "15px 11px",
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    height: "42px",
    gap: "10px",
    borderRadius: "15px",
    border: "1px solid #000",
    background: "#1C2E33",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-1.44px",
    marginBottom: "25px",
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

const ConfirmEmailModal = ({ open, onClose, currentEmail }) => {
    const { token } = useAuth();
    const dispatch = useDispatch();
    const [confirmEmail, setConfirmEmail] = useState("");
    const {t} = useTranslation("ProfilePage");

    const handleSubmit = async () => {
        if (currentEmail != confirmEmail) {
            dispatch(
                showMessage({
                    message: `${t("Invalid_Email_MSG")}`,
                    variant: 'warning'
                }));
            return;
        }

        deleteAccount();
    };

    const deleteAccount = async () => {
        try {
            const res = await axios.post(appConfig.API_SERVER + "customer/user/delete",
                {
                    user_token: token,
                });
            dispatch(
                showMessage({
                    message: res.data.message,
                    variant: 'success'
                }));

            onClose();

            window.location.reload();

        } catch (err) {
            if (err.response && (err.response.status == 400 || err.response.status == 500)) {
                dispatch(
                    showMessage({
                        message: err.response.data.error,
                        variant: 'error'
                    }));
            } else {
                console.log(err);
                dispatch(
                    showMessage({
                        message: `${t("Fail_Delete_MSG")}`,
                        variant: 'error'
                    }));
            }
        }
    };

    return (
        <StyledDialog open={open} onClose={onClose}>
            <div className="closeButton" onClick={onClose}>X</div>
            <DialogTitle>
                {t("Delete_Account_Title")}
            </DialogTitle>
            <DialogContent>
                <div className="inputContainer">
                    <p>{t("Confirm_Email")}</p>
                    <input type="text" value={confirmEmail} onChange={event => setConfirmEmail(event.target.value)} />
                </div>
            </DialogContent>
            <DialogActions>
                <StyledSaveButton
                    whileHover={hoverAnimation}
                    whileTap={tapAnimation}
                    onClick={handleSubmit}>
                    {t("Confirm")}
                </StyledSaveButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default ConfirmEmailModal;
