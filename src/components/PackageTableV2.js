import React, { useState, useEffect } from 'react';
import packagesData from '../vms2.json';
import './PackageTable.css';
import Modal from './Modal';

const PAGE_SIZE = 10;

const PackageTable = () => {
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  async function fetchData() {
    try {
      const response1 = fetch(
        'http://localhost:3000/vms/api1/installed-packages',
      );
      const response2 = fetch('http://localhost:3000/vms/api3/packages');

      const [data1, data2] = await Promise.all(
        [response1, response2].map((r) => r.json()),
      );

      if (
        data1['installed-packages'] &&
        Array.isArray(data1['installed-packages'])
      ) {
        const packageNames = data1['installed-packages'].map(
          (pkg) => pkg['package-name'],
        );

        // Merge the data from the second server with the packagesData array
        const mergedPackagesData = [...packagesData, ...data2].filter(
          (pkg, index, self) =>
            self.findIndex((p) => p['Package name'] === pkg['Package name']) ===
            index,
        );

        const matchingPackages = mergedPackagesData.filter((pkg) =>
          packageNames.includes(pkg['Package name']),
        );

        const updatedPackages = matchingPackages.map((pkg) => {
          const matchingPackage = data1['installed-packages'].find(
            (p) => p['package-name'] === pkg['Package name'],
          );

          return {
            'Package name': pkg['Package name'],
            'Date of collection': pkg['Date of collection'],
            'Installed version': matchingPackage['installed-version'],
            'Latest version': matchingPackage['candidate-version'],
            Details: pkg['Details'],
          };
        });

        setPackages(updatedPackages);
      }
    } catch (error) {
      console.error('Error fetching package data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDetailsClick = (pkg) => {
    const originalPackage = packagesData.find(
      (originalPkg) => originalPkg['Package name'] === pkg['Package name'],
    );

    const pkgDetails = {
      ...pkg,
      CVEs:
        originalPackage &&
        originalPackage.CVEs &&
        originalPackage.CVEs['id-cve']
          ? originalPackage.CVEs['id-cve']
          : 'Not found',
      'Release notes':
        originalPackage &&
        originalPackage.CVEs &&
        originalPackage.CVEs['Details']
          ? originalPackage.CVEs['Details']
          : 'Not found',
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
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentPackages.map((pkg, index) => (
            <tr key={startIndex + index}>
              <td>{pkg['Package name']}</td>
              <td>{pkg['Installed version']}</td>
              <td>{pkg['Latest version']}</td>
              <td>{pkg['Date of collection']}</td>
              <td>
                <button
                  className="details-button"
                  onClick={() => handleDetailsClick(pkg)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-button ${
              currentPage === page ? 'active' : ''
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
