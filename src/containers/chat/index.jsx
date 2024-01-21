import { useEffect, useRef, useState } from "react";

import { ChatBox } from "./chatbox";
import Navbar from "../../Components/navbar/Navbar";
import AttentionNote from "../../Components/AttentionNote/AttentionNote";
import Button from "../../Components/Button/Button";
import { Faq } from "./faq";
import { AboutUs } from "./aboutUs";
import { SubUnsubUsers } from "./SubUnsubUsers";
import { SubscriptionModal } from "../../Components/modal/SubscriptionModal";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import axios from "axios";
import { ChatTooltip } from "../../Components/Charts/tooltip";
export const ChatComponent = () => {
  const username = localStorage.getItem("username");
  const messagesEndRef = useRef(null);
  const promptRef = useRef(null);
  const newMessage = useRef(null);
  const [showFaqs, setShowFaqs] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [PromtLimitmodal, setPromtLimitmodal] = useState(false);
  const [chatWith, setChatWith] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [subscribed, setSubscribed] = useState(null);
  const [subsInfoModal, setSubsInfoModal] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [promptSelected, setPromptSelected] = useState();
  const [editPromptSelected, setEditPromptSelected] = useState(false);
  const [editPromptText, setEditPromptText] = useState();
  const [NumberofSubcriber, setNumberofSubcriber] = useState('');
  const [NumberofUnsubcriber, setNumberofUnsubcriber] = useState('');
  const [question, setQuestion] = useState(0);
  const [textt, setTextt] = useState(null);
  const [check, setCheck] = useState(4);
  const [ipAddress, setIPAddress] = useState("");

  const [count, setcount] = useState(0);
  const [prompt, setPrompt] = useState(null);
  const apiServer = import.meta.env.VITE_REACT_APP_API_URL;

  const access_token = localStorage.getItem("access_token");

  const SubmitQuestion = async (formData) => {
    try {
      var btn = document.getElementById('submit-question');
      btn.disabled = true;
      const response = await axios.post(`${apiServer}/api/admin/questions/`,
        formData,
      );
      const answer = response.data;
      setPrompt(answer.prompt_id);
      if (answer) {
        const newMessage = {
          DateAndtime: Date.now(),
          message: answer.data,
          sources: answer.sources,
          message_by: answer.message_by,
          attachment: answer.attachments,
          status: -1,
          id: answer.id,
        };
        setChatWith((prevState) => [...prevState, newMessage]);
      }
      btn.disabled = false;
      fetchChatData();
    }
    catch (error) {
      console.log(error);
    }
  };

  const fetchChatData = async () => {
    let data;
    const resp = await axios.get(`${apiServer}/api/admin/question?query=${user}`);
    setcount(resp.data.questions.total);
    data = resp.data.questions.documents;
    let prompt_array = [];
    let prompt_id = 0;
    const MAX_WORDS = 5;

    data.forEach((item) => {
      const myquestion = item.question;
      if (item.prompt_id.$id != prompt_id) {
        prompt_id = item.prompt_id.$id;
        const words = myquestion.split(" ").filter(Boolean);
        const wordCount = words.length;
        let truncatedAnswer = "";
        let remainingWords = "";
        if (wordCount <= 5) {
          truncatedAnswer = item.question.split(" ").slice(0, MAX_WORDS).join(" ");
        } else {
          truncatedAnswer =
            item.question.split(" ").slice(0, MAX_WORDS).join(" ") + "...";
          remainingWords = item.question.split(" ").slice(MAX_WORDS).join(" ");
        }
        prompt_array.push({
          prompt_id: prompt_id,
          created_at: item.prompt_id.$createdAt,
          message: truncatedAnswer,
          tooltipContent: remainingWords,
          truncatedAnswer: truncatedAnswer,
          data: []
        });
      }

      const question = {
        DateAndtime: item.created_at,
        message: item.answer,
        message_by: user,
        attachment: item.attachments == null ? [] : item.attachments?.split(', ') ,
        status: item.status,
        id: item.$id,
        answer: item.answer,
        question: item.question,
        sources: item.sources == null ? [] : item.sources?.split(', ')
      };
      const promptIndex = prompt_array.findIndex((prompt) => prompt.prompt_id === prompt_id);

      if (promptIndex !== -1) {
        prompt_array[promptIndex].data.push(question);
      }
    });
    setPrompts(prompt_array);
  };

  const fetchCountOfUsers = async () => {
    const resp = await axios.get(`${apiServer}/api/admin/permissions/`);
    const permissionData = resp.data.permissions;
    if (!subscribed) {
      setNumberofUnsubcriber(permissionData.unsubscriber);
    } else {
      setNumberofSubcriber(permissionData.subscriber);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!subscribed) {
        try {
          const response = await fetch("https://api.ipify.org/?format=json");
          const data = await response.json();
          if (data && data.ip) {
            setIPAddress(data.ip);
            if (!localStorage.getItem('username') || localStorage.getItem('username') === "") {
              setUser(data.ip);
              fetchChatData();
            }
          }
          fetchCountOfUsers();
          setTextt(`${count}/${NumberofUnsubcriber} messages restants`);
          setCheck(NumberofUnsubcriber);
        } catch (error) {
          console.log("Error fetching IP address:", error);
        }
      } else {
        fetchChatData();
        fetchCountOfUsers();
        setCheck(NumberofSubcriber);
        setTextt(`${count}/${NumberofSubcriber} messages restants`);
      }
    };

    fetchData();

  }, [subscribed, user]);


  useEffect(() => {
    if (access_token) {
      setCheck(NumberofSubcriber);
      setTextt(`${count}/${NumberofSubcriber} messages restants`);
    } else {
      setTextt(`${count}/${NumberofUnsubcriber} messages restants`);
      setCheck(NumberofUnsubcriber);
    }
  }, [NumberofUnsubcriber]);

  useEffect(() => {
    if (access_token) {
      setCheck(NumberofSubcriber);
      setTextt(`${count}/${NumberofSubcriber} messages restants`);
    } else {
      setTextt(`${count}/${NumberofUnsubcriber} messages restants`);
      setCheck(NumberofUnsubcriber);
    }
  }, [count]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (newMessage.current.value === "") {
      return alert("Please enter message to submit");
    } else {
      setSubsInfoModal(false);
      let index = prompts.length + 1;
      if (
        prompts.length >= NumberofUnsubcriber &&
        !subscribed
      ) {
        setPromtLimitmodal(!PromtLimitmodal);
      } else if (count >= check) {
        alert("Your have reached your limits");
      } else {
        let arr = [...chatWith];
        var bodyFormData = new FormData();
        bodyFormData.append("question", newMessage.current.value);
        if (!subscribed && localStorage.getItem("username") == null) {
          bodyFormData.append("ip_address", ipAddress);
        } else if (subscribed && localStorage.getItem("username") != null) {
          bodyFormData.append("username", localStorage.getItem("username"));
        }

        if (
          !subscribed &&
          localStorage.getItem("username") == null &&
          count >= NumberofUnsubcriber
        ) {
          setPromtLimitmodal(!PromtLimitmodal);
        } else {
          setQuestion(question + 1);

          arr.push({
            DateAndtime: Date.now(),
            message: newMessage?.current?.value,
            message_by: user,
            attachment: false,
          });
          setcount(count + 1);
          setSubsInfoModal(false);

          setChatWith(arr);

          if (chatWith.length == 0) {
            bodyFormData.append('prompt_id', '');
          } else {
            bodyFormData.append('prompt_id', prompt);
          }
          SubmitQuestion(bodyFormData);

        }
      }
    }
    newMessage.current.value = "";
  };

  const onEnterSubmit = () => {
    if (newMessage.current.value === "") {
      return alert("Please enter message to submit");
    } else {
      let index = prompts.length + 1;
      if (
        prompts.length >= NumberofUnsubcriber &&
        !subscribed

      ) {
        setPromtLimitmodal(!PromtLimitmodal);
      } else if (count >= check) {
        alert("Your have reached your limits");
      } else {
        let arr = [...chatWith];
        var bodyFormData = new FormData();
        bodyFormData.append("question", newMessage.current.value);
        if (!subscribed && localStorage.getItem("username") == null) {
          bodyFormData.append("ip_address", ipAddress);
        } else if (subscribed && localStorage.getItem("username") != null) {
          bodyFormData.append("username", localStorage.getItem("username"));
        }

        if (
          !subscribed &&
          localStorage.getItem("username") == null &&
          count >= NumberofUnsubcriber
        ) {
          setPromtLimitmodal(!PromtLimitmodal);
        } else {
          setQuestion(question + 1);

          arr.push({
            DateAndtime: Date.now(),
            message: newMessage?.current?.value,
            message_by: user,
            attachment: false,
          });

          setcount(count + 1);

          setChatWith(arr);

          if (chatWith.length == 0) {
            bodyFormData.append('prompt_id', '');
          } else {
            bodyFormData.append('prompt_id', prompt);
          }
          SubmitQuestion(bodyFormData);

        }
      }
    }
    newMessage.current.value = "";
  };

  const handleLike = async(id, status) => {
    status = status == true ? 1 : 0;
    var bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('status', status)
    const response = await axios.put(`${apiServer}/api/admin/questions/`,
      bodyFormData,
    );
    if (response.status == 200) {
      const updated_chat_with = chatWith.map(item => {
        if (item.id === id) {
          return { ...item, status: status };
        }
        return item;
      });

      setChatWith(updated_chat_with);
    }
  };

  const handleCloseProfile = (id) => {
    setShowUserProfile(false);
  };

  const handleCloseFront = (id) => {
    setSubsInfoModal(false);
  };

  const HandleClick = () => {
    if (count >= check) {
      setPromtLimitmodal(true);
    } else {
      let clone = [...prompts];
      const question = {
        DateAndtime: "",
        message: "",
        message_by: user,
        attachment: false,
        tooltipContent: "",
        tooltip: true,
        status: 1,
        id: clone.length,
        truncatedAnswer: "New Prompt",
        answer: "",
        question: "New Prompt",
      };

      clone.push(question);
      setPrompts(clone);
    }
  };

  useEffect(() => {
    const value = localStorage.getItem("access_token");

    if (value != null) {
      setSubscribed(true);
      setSubsInfoModal(false);
    }
  }, [subscribed]);

  useEffect(() => {
    if (location?.pathname === "/chat") {
      setSubsInfoModal(false);
    }
  }, [location?.pathname]);

  useEffect(() => {
    if (showAboutUs || showFaqs || showUserProfile) {
      setShowModal(false);
    }
  }, [showAboutUs, showFaqs, showUserProfile]);

  useEffect(() => {
    if (showModal) {
      setShowAboutUs(false);
      setShowFaqs(false);
      setShowUserProfile(false);
    }
  }, [showModal]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(scrollToBottom, [chatWith]);
  const scrollToBottomPrompt = () => {
    promptRef?.current?.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(scrollToBottomPrompt, [prompts]);

  const onSelectPrompt = (item) => {
    setSubsInfoModal(false);
    let arr = [];
    if (item.data && item.data.length > 0) {
      item.data.map((it, index) => {
        const question = {
          DateAndtime: it.created_at,
          message: it.question,
          message_by: user,
          attachment: false,
          sources: []
        };

        arr.push(question);
        const answer = {
          DateAndtime:it.DateAndtime,
          message: it.answer,
          attachment: it.attachment,
          tooltip: true,
          status: it.status,
          id: it.id,
          answer: it.answer,
          question: it.question,
          sources: it.sources
        };
        arr.push(answer);
      });
      setPrompt(item.prompt_id);
      setChatWith(arr);
    } else {
      setPrompt(null);
      setChatWith([]);
    }
  };

  const onEditPrompt = () => {
    const clone = [...prompts];
    clone[promptSelected] = editPromptText;
    setPrompts(clone);
    setEditPromptSelected(!editPromptSelected);
  };
  return (
    <div className="flex flex-col ">
      {!subscribed && PromtLimitmodal && (
        <SubscriptionModal
          type={1}
          onClick={() => setPromtLimitmodal(!PromtLimitmodal)}
        />
      )}
      <Navbar
        onOpenModal={() => setShowModal(!showModal)}
        onOpenAbout={() => setShowAboutUs(!showAboutUs)}
        text={textt}
      />

      <div className="flex w-full h-[88vh] space-x-4 bg-bgCremo">
        <div className="w-72 flex flex-col justify-between  items-center bg-bgCremo p-5">
          <div>
            <Button
              onClick={() => HandleClick(prompts.length + 1)}
              text="Nouvelle question"
            />
            <div
              className={`flex flex-col space-y-4 w-full py-4 ml-3 ${prompts.length > 2 && "h-72 overflow-y-scroll"
                }`}
            >
              {prompts?.map((item, index) => (
                <div
                  ref={promptRef}
                  key={index}
                  onClick={() => onSelectPrompt(item)}
                  className={`text-sm w-full font-medium px-4 bg-white py-2 rounded-full flex space-x-2`}
                >
                  {index === promptSelected && editPromptSelected ? (
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        className="outline-none h-full w-full"
                        onChange={(e) => setEditPromptText(e.target.value)}
                      />
                      <div className="flex space-x-1">
                        <FaCheck
                          className="cursor-pointer"
                          onClick={onEditPrompt}
                        />
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() => setEditPromptSelected(false)}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {item?.tooltip ? (
                        <ChatTooltip
                          tooltip={item?.tooltipContent}
                          orignal={item?.truncatedAnswer}
                        />
                      ) : (
                        // Render this block if items.tooltip is truthy

                        // Render this block if items.tooltip is falsy
                        <span className="w-32 line-clamp-1">
                          {" "}
                          {item.message}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="ml-3">
            <AttentionNote />
          </div>
        </div>
        <div className="w-full bg-white mt-5 rounded-lg">
          <ChatBox
            newMessage={newMessage}
            messagesEndRef={messagesEndRef}
            submitHandler={submitHandler}
            onEnterSubmit={onEnterSubmit}
            chatWith={chatWith}
            handleLike={handleLike}
            user={user}
            subscribed={subsInfoModal}
            setSubscribed={() => setSubsInfoModal(!subsInfoModal)}
            handleCloseFront={handleCloseFront}
          />
        </div>

        {!subscribed && showModal ? (
          <SubUnsubUsers
            onOpenModal={() => setShowModal(!showModal)}
            type={2}
            onOpenSignUp={() => setShowUserProfile(!showUserProfile)}
            onOpenFaqs={() => setShowFaqs(!showFaqs)}
            onOpenAboutUs={() => setShowAboutUs(!showAboutUs)}
          />
        ) : (
          subscribed &&
          showModal && (
            <SubUnsubUsers
              onOpenModal={() => setShowModal(!showModal)}
              type={1}
              onOpenSignUp={() => setShowUserProfile(!showUserProfile)}
              onOpenFaqs={() => setShowFaqs(!showFaqs)}
              onOpenAboutUs={() => setShowAboutUs(!showAboutUs)}
            />
          )
        )}
        {showFaqs && <Faq onOpenFaqs={() => setShowFaqs(!showFaqs)} />}
        {showAboutUs &&
          <AboutUs onOpenAboutUs={() => setShowAboutUs(!showAboutUs)} />
        }
      </div>
    </div>
  );
};
