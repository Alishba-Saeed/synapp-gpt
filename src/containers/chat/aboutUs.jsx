import { AiOutlineClose } from "react-icons/ai";

export const AboutUs = ({ onOpenAboutUs }) => {
  return (
    <div className="flex flex-col w-3/12 space-y-2  py-4 -mt-4 pr-2 bg-white rounded-lg">
     <div className="flex flex-row">
        <h3 className="flex-1 text-center m-0">About Us</h3>
        <div className="flex-1 flex justify-end">
          <AiOutlineClose
            className="self-end text-xs cursor-pointer"
            onClick={onOpenAboutUs}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-5 items-center bg-white p-5 overflow-y-auto">
        <div className="text-center bg-textSenderBG rounded-md py-4">
          Prompt 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus dictum lorem, quis convallis a rcu porttitor non. Nulla tempor dolor sit amet semper pharetra
        </div>
        <div className="text-center bg-textSenderBG rounded-md py-4">
          Prompt 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus dictum lorem, quis convallis a rcu porttitor non. Nulla tempor dolor sit amet semper pharetra
        </div>
        <div className="text-center bg-textSenderBG rounded-md py-4">
          Prompt 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus dictum lorem, quis convallis a rcu porttitor non. Nulla tempor dolor sit amet semper pharetra
        </div>
      </div>
    </div>
  );
};
