import React, { useEffect, useRef, useState } from "react";
import { MailOutline, NotificationsOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import moment from "moment";

function MessageNatification() {
  const container = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [usermessage] = useState([
    // {
    //   sender: {
    //     email: "alisher@gmail.com",
    //     profileImage: {
    //       url: "https://cdn.britannica.com/83/195983-138-66807699/numbers-tiger-populations.jpg?w=800&h=450&c=crop",
    //     },
    //     username: "Alisher",
    //     fullname: "Alisher Saddulayev",
    //   },
    //   text: "rb erb erbre rbrb errbr ebw efwegw eg q  egqw gqegeg qe qr gqg  gqg gqgrgqrgqrg qg qergqe gq gq",
    //   createdAt:
    //     "Tue Jan 15 2024 15:01:25 GMT+0500 (Узбекистан, стандартное время)",
    //   _id: "131g45g2v42s5t52v423t4t234t",
    // },
    // {
    //   sender: {
    //     email: "feruz@gmail.com",
    //     profileImage: {
    //       url: "https://cdn.britannica.com/83/195983-138-66807699/numbers-tiger-populations.jpg?w=800&h=450&c=crop",
    //     },
    //     username: "Feruz",
    //     fullname: "Feruz Saddulayev",
    //   },
    //   text: "rb erb erbre rbrb errbr ebw efwegw eg q  egqw gqegeg qe qr gqg  gqg gqgrgqrgqrg qg qergqe gq gq",
    //   createdAt:
    //     "Tue Jan 18 2024 11:41:55 GMT+0500 (Узбекистан, стандартное время)",
    //   _id: "131g45efv42s5t52v423t4t234t",
    // },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id !== "messageNotification") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        data-dropdown-toggle
        className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
        type="button"
        id="messageNotification"
        ref={container}
      >
        <span id="messageNotification" className="relative inline-block mt-1">
          <MailOutline id="messageNotification" fontSize="medium" />
          {usermessage.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center px-1 py-1 text-[9px] font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
           {usermessage.length}
          </span>
          )}
        </span>
      </button>
      {isOpen && (
        <div
          className="grid fixed z-[20] left-0 w-screen h-screen justify-center items-center"
          id="modalContainer"
        >
          <div
            className={`md:place-self-end md:mr-[17.5rem] md:top-0 place-self-auto ${
              isOpen ? "block" : "hidden"
            } absolute z-[21] w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700`}
            aria-labelledby="messageNotificationButton"
          >
            <div
              id="messageNotification"
              className="flex items-center gap-1 px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
            >
              <MailOutline fontSize="medium" className="text-base" />
              <p>Inbox {usermessage.length}</p>
            </div>
            <div className="divide-y h-[24rem] overflow-y-auto divide-gray-100 dark:divide-gray-700">
              {usermessage.length > 0 ? (
                <>
                  {usermessage.map((item) => (
                    <Link
                      key={item._id}
                      to="/buyer/orders/messages/1"
                      className="items-center flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        {item.sender.profileImage ? (
                          <img
                            className="rounded-full w-11 h-11 object-cover "
                            src={item.sender.profileImage.url}
                            alt={item.sender.username}
                          />
                        ) : (
                          <div className="bg-purple-500 h-11 w-11 flex items-center justify-center rounded-full relative">
                            <span className="text-lg text-white">
                              {item.sender.email[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full pl-3">
                        <div className="grid text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          <span className="flex font-semibold text-gray-900 dark:text-white">
                            {item.sender.username}
                          </span>
                          {item.text.length > 73 ? (
                            <span>
                              {item.text.substring(0, 73)}
                              ...
                            </span>
                          ) : (
                            <span>{item.text}</span>
                          )}
                        </div>
                        <div className="flex">
                          <span className="text-xs text-blue-600 dark:text-blue-500">
                            {moment(item.createdAt).format("DD,MM,YYYY HH:mm")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )).reverse()}
                </>
              ) : (
                <div className="flex flex-col items-center bg-white h-full justify-center leading-5 text-center">
                    <strong className="contents text-[17px] font-normal pb-[10px]">
                    <span className="h-[55px] w-[55px] grid justify-center rounded-full bg-zinc-100">
                        <NotificationsOff  style={{fontSize:"30px"}} className="self-center" />
                    </span>
                    </strong>
                    <p className="text-[#b5b6ba] text-[14px] max-w-[240px]">
                        Browse our amazing catalog of gigs or offer your telent on Fiverr
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageNatification;
