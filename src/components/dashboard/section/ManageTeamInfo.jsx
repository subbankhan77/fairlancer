"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  // fetchTeams - commented out in teamSlice
  createTeam,
  // updateTeam - commented out in teamSlice
  // deleteTeam - commented out in teamSlice
  setCurrentPage 
} from '@/store/slices/teamSlice';

import Pagination1 from "@/components/section/Pagination1";
import DeleteModal from "../modal/DeleteModal";
import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";
import TeamCardSkeleton from "@/components/custom/loader/TeamCardSkeleton";

// Import the components for Teams module
import TeamCard from "@/components/custom/dashboard/common/TeamCard";
import CreateTeamModal from "../modal/CreateTeamModal";
import TeamDetailsModal from "../modal/TeamDetailsModal";

// Import commonService for API calls that are not in teamSlice
import { commonService } from '@/services/common';

export default function ManageTeamInfo() {
  
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { teams, lastPage, currentPage, isLoading, isSubmitting } = useSelector(state => state.teams);
  
  // Local state for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [localTeams, setLocalTeams] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch teams on component mount
  useEffect(() => {
    // Since fetchTeams is commented out in teamSlice, we'll fetch directly
    fetchTeamsData();
  }, []);

  // Fetch teams data directly using commonService
  const fetchTeamsData = async () => {
    try {
      setLocalLoading(true);
      // Assuming you have a service method to fetch teams
      const response = await commonService.showteam();
      if (response && response.data) {
        setLocalTeams(response.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    // Implement pagination logic here with commonService if needed
  };

  const handleCreateTeam = async (teamData) => {
    try {
      dispatch(createTeam(teamData)).then(() => {
        // Refresh teams after creation
        fetchTeamsData();
        setIsCreateModalOpen(false);
      });
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const openCreateTeamModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewTeamDetails = (team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(true);
  };

  // Determine if we should use local state or redux state
  const teamsToDisplay = teams?.length > 0 ? teams : localTeams;
  const loadingState = isLoading || localLoading;

  return (
    <>
      <div className="dashboard__content hover-bgc-color pt20">
        <Breadcumb path={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Teams", link: "/teams" },
        ]}/>
        <div className="d-flex justify-content-between align-items-center mb20">
          <BreadCrumbHeader
            title="Manage Teams"
            description="Team List"
          />
          
          <button 
            className="ud-btn btn-thm add-listing" 
            onClick={openCreateTeamModal}
          >
            <i className="fas fa-plus me-2"></i> Create Team
          </button>
        </div>
        
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
              <section className="pt30 pb90">
                <div className="container">
                  <div className="row">
                    {loadingState ? (
                      <div className="col-md-12">
                        {[1, 2, 3].map((index) => (
                          <TeamCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : (
                      teamsToDisplay?.length ? (
                        <>
                          {teamsToDisplay.map((team, index) => (
                            <TeamCard 
                              key={index} 
                              data={team} 
                              onView={() => handleViewTeamDetails(team)}
                            />
                          ))}
                          {
                            lastPage > 1 ? (
                              <Pagination1 
                                currentPage={currentPage}
                                totalPages={lastPage}
                                onPageChange={handlePageChange}
                              />
                            ) : ""
                          }
                        </>
                      ) : (
                        <div className="col-md-12 text-center">
                          <p>No teams found</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTeam}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Team Details Modal */}
      {isDetailsModalOpen && (
        <TeamDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          team={selectedTeam}
        />
      )}
    </>
  );
}