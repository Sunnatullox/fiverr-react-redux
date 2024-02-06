import React from "react";

function ProfileMenu({ menuData }) {
  return (
    <div
      className={`z-[99] bg-white divide-gray-100 shadow-2xl border w-44 dark:bg-gray-700 fixed right-5 top-20`}
    >
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {menuData.map(({ name, callback }, i) => (
          <li
            key={i}
            onClick={callback}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileMenu;
