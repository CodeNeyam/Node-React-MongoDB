import React, { useState, useEffect } from "react";
// Remove this line
// import packagesData from '../vms2.json';
import "./PackageTable.css";
import Modal from "./Modal";

const PAGE_SIZE = 10;

const PackageTable = () => {
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  async function fetchData() {
    const response = await fetch("http://localhost:5000/api/getPackages");
    const data = await response.json();
    console.log("Response from API:", data); // Debug statement
    setPackages(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const compareVersions = (installedVersion, latestVersion) => {
    return installedVersion === latestVersion ? "Latest" : "Out of date";
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDetailsClick = (pkg) => {
    const originalPackage = packages.find(
      (originalPkg) => originalPkg["Package name"] === pkg["Package name"]
    );

    const pkgDetails = {
      ...pkg,
      CVEs:
        originalPackage &&
        originalPackage.CVEs &&
        originalPackage.CVEs["id-cve"]
          ? originalPackage.CVEs["id-cve"]
          : "Not found",
      "Release notes":
        originalPackage &&
        originalPackage.CVEs &&
        originalPackage.CVEs["Details"]
          ? originalPackage.CVEs["Details"]
          : "Not found",
    };

    setModalContent(pkgDetails);
    setShowModal(true);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPackages = packages.slice(startIndex, endIndex);

  const totalPages = Math.ceil(packages.length / PAGE_SIZE);

  return (
    <div className="package-table-container">
      {showModal && (
        <Modal content={modalContent} onClose={() => setShowModal(false)} />
      )}
      <table className="package-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Installed Version</th>
            <th>Latest Version</th>
            <th>Date of Collection</th>
            <th>Version</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentPackages.map((pkg, index) => {
            const versionStatus = compareVersions(
              pkg["Installed version"],
              pkg["Latest version"]
            );
            const versionClass =
              versionStatus === "Latest" ? "latest" : "out-of-date";
            return (
              <tr key={startIndex + index}>
                <td>{pkg["Package name"]}</td>
                <td>{pkg["Installed version"]}</td>
                <td>{pkg["Latest version"]}</td>
                <td>{pkg["Date of collection"]}</td>
                <td className="version-td">
                  {pkg["Installed version"] === pkg["Latest version"] ? (
                    <span className="latest">Latest</span>
                  ) : (
                    <span className="out-of-date">Out of date</span>
                  )}
                </td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => handleDetailsClick(pkg)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-button ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PackageTable;
