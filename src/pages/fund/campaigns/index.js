import { useState, useEffect } from "react";
import HTMLHead from "../../../common/components/HTMLHead";
import styles from "../../../styles/fundCampaignIndex.module.css";
import CampaignCard from "../../../common/components/UI/AllCampaigns/CampaignCard";
import { Button, Spinner, Badge } from "react-bootstrap";
import Link from "next/link";
import HeadingCtrls from "../../../common/components/UI/AllCampaigns/HeadingCtrls";
import moment from "moment";

export const getStaticProps = async () => {
  const res = await fetch("https://crowdfund-ccgg6dlco-sarthakkumar766.vercel.app/api/all-campaigns");
  const data = await res.json();
  return {
    props: { campaigns: data },
  };
};

const index = ({ campaigns }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatedCampaigns, setUpdatedCampaigns] = useState(campaigns);
  const handleSearch = (e) => {
    setIsLoading(true);
    const value = e.target.value;
    setSearch(value);
    let filteredCampaigns = campaigns.filter(function (el) {
      return el.title.includes(value);
    });
    setIsLoading(false);
    setUpdatedCampaigns(filteredCampaigns);
  };
  const getFormattedDate = (deadlineInt) => {
    const date = new Date(deadlineInt * 1000);
    const dateFormatted = moment(date).format("MMMM Do YYYY");
    const formatReturn = `${dateFormatted}`;
    return formatReturn;
  };
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <HTMLHead title="All Campaign" />
      <div className={`${styles.mainControl} ${styles.bodyPaddingControl}`}>
        <HeadingCtrls handleSearch={handleSearch} search={search} />
        <div className={styles.mainControl}>
          {isLoading ? (
            <div className="w-100 d-flex justify-content-center position-absolute top-50">
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Loading...
              </Button>
            </div>
          ) : updatedCampaigns.length > 0 ? (
            updatedCampaigns.map((campaign) => (
              <Link href={`/fund/campaigns/${campaign.uid}`} key={campaign.uid}>
                <a className="w-100 text-decoration-none">
                  <CampaignCard
                    uid={campaign.uid}
                    src={`/projectAssets/${campaign.uid}/${campaign.coverImage}`}
                    header={campaign.title}
                    description={campaign.description}
                    tokenAmount={campaign.goalEthAmt}
                    percentage={campaign.percentageCompleted}
                    deadlineDate={getFormattedDate(campaign.deadlineInt)}
                    state={campaign.state}
                    chainID=""
                  />
                </a>
              </Link>
            ))
          ) : (
            <>
              <div className="w-100 d-flex justify-content-center align-items-center" style={{"height": "400px"}}>
                <h2>
                  <Badge bg="danger">No Data Found!!!</Badge>
                </h2>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default index;
