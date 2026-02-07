import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { report } from "../../constants/reports";
import { dummyPosts } from "../../constants/dummyPosts";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Delete02Icon, Flag01Icon } from "@hugeicons/core-free-icons";

export default function ReportedPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isBanned, setIsBanned] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const reportData = report.find((r) => r.reportid === id);

  useEffect(() => {
    const post = dummyPosts.find((p) => p.id === reportData.postId);
    setPost(post);
  }, [reportData.postId]);

 

  const handleDeleteUser = (userToDelete) => {
    console.log(`Post by ${userToDelete.name} deleted`);
    navigate("/content-moderation");
  };

  const handleBanUser = (userToBan, newBanStatus) => {
    setIsBanned(newBanStatus);
    console.log(
      `User ${userToBan.name} status changed to ${
        newBanStatus ? "Banned" : "Active"
      }`
    );
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
   

      {/* Main Content */}
      <div className="bg-white rounded-lg">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 ">
          {/* Title & Status */}
          <div className="flex items-center gap-4">
            <h1 className="text-[32px] font-bold">Reported Post</h1>
            <div
              className={`flex items-center gap-2 px-2 rounded-full py-1 ${
                isBanned ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <span className="text-sm text-gray-600">
                {isBanned ? "Banned" : "Active"}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isBanned ? "bg-red-500" : "bg-green-500"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowBanModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                isBanned
                  ? "bg-[#FCEFEA] text-[#DD612C] border-red-500 hover:bg-red-100"
                  : "border-[#DD612C] text-[#DD612C] hover:bg-red-50"
              }`}
            >
              <HugeiconsIcon icon={Flag01Icon} className="w-6 h-6" />
              Ban
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-6 h-6" />
              Delete
            </button>
          </div>
        </div>

        {/* Image and any other content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              className="w-full max-w-xs h-auto md:w-[280px] md:h-[220px] object-contain"
              src="https://plus.unsplash.com/premium_photo-1679710943658-1565004c00ac?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={post.postedBy}
            />
            {/* Additional content can go here */}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                Reported ID
              </label>
              <div className="text-gray-900 text-[16px] font-medium border-b border-[#D8D4E0] py-[12px]">
              {reportData.reportid}
              </div>
            </div>
            <div>
              <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                Post Title
              </label>
              <div className="text-gray-900 text-[16px] font-medium border-b border-[#D8D4E0] py-[12px]">
                {post.description}
              </div>
            </div>
         
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                Reported By
              </label>
              <div className="text-gray-900 text-[16px] font-medium border-b border-[#D8D4E0] py-[12px]">
                {post.postedBy}
              </div>
            </div>
            <div>
              <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                Reason
              </label>
              <div className="text-gray-900 text-[16px] font-medium border-b border-[#D8D4E0] py-[12px]">
                Hate speech / abusive content
              </div>
            </div>
           
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          onConfirm={() => {
            handleDeleteUser(post);
            setShowDeleteModal(false);
          }}
          title={`Are you sure you want to delete ${post?.name}?`}
          option1="Yes, delete it"
          option2="Cancel"
        />
      )}

      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
          }}
          onConfirm={() => {
            const newBanStatus = !isBanned;
            handleBanUser(post, newBanStatus);
            setShowBanModal(false);
          }}
          title={`Are you sure you want to ${isBanned ? "unban" : "ban"} ${
            post?.name
          }?`}
          option1={`Yes, ${isBanned ? "unban" : "ban"} user`}
          option2="Cancel"
        />
      )}
    </div>
  );
}
