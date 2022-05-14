import React from "react";

export default function Modal( { open , text}) {
  return (
    //  <!-- component -->
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      
      id="modal-id"
      
      style={{ display: open ? 'flex' : 'none' }}
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        {/* <!--content--> */}
        <div className="">
          {/* <!--body--> */}
          <div className="text-center p-5 flex-auto justify-center">
            <textarea name="" id="" 
            rows="10"
            className="border-2 border-gray-400 rounded-md p-3 w-full"
            value={text}
            ></textarea>
          </div>
          {/* <!--footer--> */}
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
              Cancel
            </button>
            <button className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
