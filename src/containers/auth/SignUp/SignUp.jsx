import NavBtn from "../../../Components/Button/NavBtn";
import Notes from "../../../Components/Notes/Notes";
import {
  InputWithEmoji,
  InputWithCheckbox,
} from "../../../Components/InputTag/InputWithLabel";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "../../../assets/path";
import Navbar from "../../../Components/navbar/Navbar";
import axios from "axios";


import React, { useEffect } from "react";

export const SignUp = ({ formData, onNextStep ,onPreviousStep}) => {
  const navigate = useNavigate();
  const Previous = e => {
    e.preventDefault();
    onPreviousStep()
  }

  const registerUser = async (userInfo) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users',
        userInfo,
      );
      if (response.status == 201) {
        navigate("/finalscr");
      }
    }
      catch (error) {
        console.log(error.response.data.errors.user);
    }
  }

  const handleNext = () => {
    const form = document.getElementById("RegisterForm");
    const newFormData = new FormData(form);
    let is_cgu = newFormData.get("cgu");
    let is_pdp = newFormData.get("pdp");
    const profession = newFormData.get("profession");
    const speciality = newFormData.get("speciality");

    if (is_cgu === null || is_pdp === null) {
      alert("Please select Checkbox");
      console.log("checkalert");
    } else {
      const normalizeCheckbox = (value) => (value === 'on' ? 'True' : 'False');

      is_cgu = normalizeCheckbox(is_cgu);
      is_pdp = normalizeCheckbox(is_pdp);

      const name = formData.full_name;
      const password = formData.password;
      const email = formData.email;

      const userInfo = { name, email, password, profession, speciality, is_cgu, is_pdp };

      registerUser(userInfo);
    }
  };



  return (
    <div className="h-screen overflow-hidden">
      <Navbar signup={true} />
      <div className="flex">
        <div className="flex flex-col items-center justify-center w-1/2 space-y-8 pb-10">
          {/* heading and description  */}
          <div className="flex flex-col space-y-2 items-center">
            <div className="text-sm text-center text-textgray">2/3</div>
            <h1 className="text-3xl text-center font-bold w-8/12">
              Une dernière chose, dites-nous qui vous êtes
            </h1>
          </div>
          {/* form  */}
          <form className="flex flex-col space-y-4" id="RegisterForm">
            <div className="flex justify-start">
              <h2 className="font-bold text-sm">Vous exercez en tant que :</h2>
            </div>

            <InputWithEmoji
              image={ASSETS.EMOJI.FACE}
              placeholder="Profession"
              bgcolor="#E3FFF4"
              name="profession"
              type="text"

            />


            <InputWithEmoji
              image={ASSETS.EMOJI.SHOCK}
              placeholder="Spécialité"
              bgcolor="#FDF4F3"
              name="speciality"
              type="text"
            />
            <div className="flex flex-col space-y-2 ">
              <InputWithCheckbox  required ='true' name="cgu" text="J’ai lu et j’accepte les conditions générales (CGU) " />
              <InputWithCheckbox  required ='true' name="pdp" text="J’ai lu et j’accepte la Politique de confidentialité des données personnelles " />
            </div>
          </form>

          {/* checkbox  */}

          {/* line bar  */}
          <div className="bg-inputBg w-full">
            <div className="h-2 w-4/12 bg-alertPink"></div>
          </div>

          {/* button  */}
          <div className="flex justify-center">
            <div className="flex space-x-20">
              <span className="bg-inputBg rounded-xl cursor-pointer">
                <HiArrowNarrowLeft
                  //onClick={() => navigate("/signup")}
                  onClick={Previous}
                  className="mt-1 m-2"
                  size={25}
                />

              </span>
                <NavBtn
                  text="C’est terminé !"
                  bgcolor="#A1FEDA"

                  onFunctionCalled={handleNext}
                  // icon={
                  //   <HiArrowNarrowRight onClick={() => ""} size={25} />
                  // }
                />

            </div>
          </div>
        </div>

        {/* image  */}
        <div className="w-1/2">
          <Notes
            image={ASSETS.PROFILES.SIGN_UP2}
            bgColor="#EDFAFA"
            notebgColor="#DCF5F5"
            color="#004A54"
            text="Des fonctionnalités médicales conçues sur mesure"
          />
        </div>
      </div>
    </div>
  );
};
