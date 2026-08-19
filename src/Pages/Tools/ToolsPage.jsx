import React from 'react';
import Container from 'react-bootstrap/Container';
import BudgetTracker from '../../Components/Tools/BudgetTracker';
import WeatherChecklist from '../../Components/Tools/WeatherChecklist';
import DocumentVault from '../../Components/Tools/DocumentVault';

function ToolsPage() {
  return (
    <div className="tools-page pb-5" style={{ paddingTop: '90px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container>
        <div className="text-start mb-4">
          <h2 className="fw-bold text-dark mb-1">🛠️ Travel Logistics & Utilities Studio</h2>
          <p className="text-muted">Manage trip budgets, group expenses, destination weather, packing lists, and PDF tickets.</p>
        </div>

        <BudgetTracker />
        <WeatherChecklist />
        <DocumentVault />
      </Container>
    </div>
  );
}

export default ToolsPage;
