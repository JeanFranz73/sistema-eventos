import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3005",
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  }
});

class CertificatesApi {
  async getCertificates() {
    return api.get("/certificates");
  }

  async getCertificate(certificateId) {
    return api.get(`/certificates/${certificateId}`);
  }

  async createCertificate(certificate) {
    return api.post("/certificates", certificate);
  }

  async updateCertificate(certificate) {
    return api.put(`/certificates/${certificate.id}`, certificate);
  }

  async deleteCertificate(certificateId) {
    return api.delete(`/certificates/${certificateId}`);
  }

}

export default new CertificatesApi();