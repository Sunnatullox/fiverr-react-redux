import React,{ useEffect, useRef, useState }  from 'react'
import {NotificationsActive, NotificationsOff} from '@mui/icons-material';
import moment from "moment";
import { Link } from 'react-router-dom';



function Notifications() {
const [notifications, setNotifications] = useState([]);
  const container = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id !== "dropdownNotification") {
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
        id="dropdownNotification"
        data-dropdown-toggle
        className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
        type="button"
        ref={container}
      >
        <span id="dropdownNotification" className="relative inline-block mt-1">
          <NotificationsActive id="dropdownNotification" fontSize='medium' className="text-[23.5px]" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-1 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
          )}
        </span>
      </button>

      {isOpen && (
        <div
          id="modalContainer"
          className="grid  fixed z-[20] left-0 w-screen h-screen justify-center items-center "
        >
          <div
            id="dropdownNotification"
            className={`md:place-self-end md:mr-[21rem]  md:top-0 place-self-center ${
              isOpen ? "block" : "hidden"
            } absolute z-[21] w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700`}
            aria-labelledby="dropdownNotificationButton"
          >
            <div
              id="dropdownNotification"
              className="gap-1 items-center flex px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
            >
              <NotificationsActive fontSize='medium' id="dropdownNotification" className="text-base" />
              <p>Notifications ({notifications.length})</p>
            </div>
            <div className="divide-y h-[24rem] overflow-y-auto divide-gray-100 dark:divide-gray-700">
              {notifications.map((item) => (
                <Link
                  href={`seller/orders/${item._id}`}
                  key={item._id}
                  className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex-shrink-0">
                    {item.buyer.profileImage ? (
                      <img
                        className="rounded-full w-11 h-11"
                        src={item.buyer.profileImage?.url || item.buyer.profileImage}
                        alt={`${item.buyer.username}`}
                      />
                    ) : (
                      <div className="bg-purple-500 h-11 w-11 flex items-center justify-center rounded-full relative">
                        <span className="text-lg text-white">
                          {item?.buyer?.email[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full pl-3">
                    <div className="grid text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                      <span className="flex font-semibold text-gray-900 dark:text-white">
                        {item.buyer.username} {item.buyer.fullname}
                      </span>{" "}
                      Gig Title :
                      {Array.from(item.gig.title).length >= 73 ? (
                        <>{item.gig.title?.slice(0, 73)}...</>
                      ) : (
                        <>{item.gig.title}.</>
                      )}
                    </div>
                    <div className="flex">
                      <p className="text-xs text-green-500">Ordered:</p>
                      <span className="ml-auto text-xs text-blue-600 dark:text-blue-500">
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </Link>
              )).reverse()}
              {notifications.length === 0 && (
                <div className=" items-center bg-white flex flex-col h-full justify-center leading-5 text-center">
                    <strong className=" contents text-[17px] font-normal pb-[10px]" >
                      <span style={{margin:"0 auto 10px"}} className="h-[55px] w-[55px] grid justify-center rounded-full bg-zinc-100">
                      <NotificationsOff
                        id="dropdownNotification"
                        fontSize='medium'
                        className="text-2xl self-center"
                      />
                      </span>
                      No Notifications
                    </strong>
                    <p className="text-[#b5b6ba] text-[14px] max-w-[240px]">​Browse our amazing catalog of Gigs or offer your talent on Fiverr.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <Link
                href="seller/orders"
                className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              >
                <div className="inline-flex items-center ">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  View all
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications
