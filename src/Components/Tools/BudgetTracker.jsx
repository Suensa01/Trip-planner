import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { useTrip } from '../../Context/TripContext';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';

function BudgetTracker() {
  const { activeTrip, addExpense, removeExpense, updateBudgetLimit } = useTrip();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Expense Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  // Budget Modal state
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudgetLimit, setNewBudgetLimit] = useState(activeTrip?.budgetLimit || '');

  const expenses = activeTrip?.expenses || [];
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const budgetLimit = Number(activeTrip?.budgetLimit) || 0;
  const percentUsed = budgetLimit > 0 ? Math.min(Math.round((totalSpent / budgetLimit) * 100), 100) : 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!activeTrip) {
      showToast('No Active Trip', 'Please create or select an active trip first.', 'warning', 'bi-exclamation-circle');
      return;
    }

    if (title && amount) {
      addExpense({
        title,
        amount: Number(amount),
        payer: user?.name || 'You',
        category,
        date: new Date().toISOString().split('T')[0]
      });
      showToast('Expense Recorded!', `Added $${amount} for "${title}" under ${category}.`, 'success', 'bi-cash-coin');
      setTitle('');
      setAmount('');
    }
  };

  const handleDeleteExpense = async (expenseId, expenseTitle) => {
    await removeExpense(expenseId);
    showToast('Expense Deleted', `Removed "${expenseTitle || 'Item'}" from ledger.`, 'danger', 'bi-trash-fill');
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!activeTrip) {
      showToast('No Active Trip', 'Please create or select an active trip first.', 'warning', 'bi-exclamation-circle');
      return;
    }

    const limitVal = Number(newBudgetLimit) || 0;
    await updateBudgetLimit(limitVal);
    showToast('Budget Updated!', `Set trip budget limit to $${limitVal}.`, 'success', 'bi-wallet-fill');
    setShowBudgetModal(false);
  };

  return (
    <Card className="card-trippoo shadow-sm border-0 rounded-4 overflow-hidden mb-4 text-start">
      <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">
          <i className="bi bi-wallet2 text-coral me-2"></i>Trip Budget & Financial Ledger
        </h5>
        
        <div className="d-flex align-items-center gap-2">
          <Badge bg={budgetLimit > 0 ? 'coral' : 'secondary'} className="px-3 py-2 fs-6">
            {budgetLimit > 0 ? `Budget: $${budgetLimit}` : 'Budget: Not Set'}
          </Badge>
          <Button 
            variant="outline-light" 
            size="sm" 
            className="fw-bold"
            onClick={() => {
              setNewBudgetLimit(budgetLimit || '');
              setShowBudgetModal(true);
            }}
          >
            <i className="bi bi-pencil-square me-1"></i>{budgetLimit > 0 ? 'Edit Budget' : 'Set Budget'}
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        {/* Progress Bar & Budget Overview */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="text-dark">Total Spending: ${totalSpent}</strong>
            <span className="small text-muted">
              {budgetLimit > 0 ? `${percentUsed}% of $${budgetLimit} limit` : 'No budget limit set'}
            </span>
          </div>
          {budgetLimit > 0 ? (
            <ProgressBar 
              now={percentUsed} 
              variant={percentUsed > 90 ? 'danger' : percentUsed > 70 ? 'warning' : 'success'} 
              className="rounded-pill" 
              style={{ height: '10px' }} 
            />
          ) : (
            <div className="p-2 bg-light rounded text-center small text-muted">
              Click <strong>"Set Budget"</strong> above to configure your target spending limit!
            </div>
          )}
        </div>

        {/* Add Expense Form */}
        <Card className="bg-light border-0 rounded-3 p-3 mb-4">
          <h6 className="fw-bold mb-3 text-dark">
            <i className="bi bi-plus-circle-fill text-coral me-2"></i>Record New Expense
          </h6>
          <Form onSubmit={handleAddExpense} className="row g-2">
            <div className="col-md-5">
              <Form.Control
                type="text"
                placeholder="Expense Description (e.g., Flight Ticket, Hotel Stay)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <Form.Control
                type="number"
                placeholder="Amount ($)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Lodging">Lodging</option>
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
                <option value="Activities">Activities</option>
                <option value="Shopping">Shopping</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Button type="submit" variant="coral" className="btn-coral w-100 fw-bold">
                Add
              </Button>
            </div>
          </Form>
        </Card>

        {/* Expense History List */}
        <h6 className="fw-bold mb-3 text-dark">
          <i className="bi bi-receipt me-2 text-primary"></i>Recorded Expenses ({expenses.length})
        </h6>

        {expenses.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted">
            <i className="bi bi-cash-stack fs-3 opacity-50 d-block mb-1"></i>
            <span className="small">No expenses recorded yet. Use the form above to log your spending!</span>
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light small text-uppercase">
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Payer</th>
                <th>Date</th>
                <th>Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, idx) => (
                <tr key={exp.id || idx}>
                  <td className="fw-semibold text-dark">{exp.title}</td>
                  <td>
                    <Badge bg="secondary" className="px-2 py-1">{exp.category || 'General'}</Badge>
                  </td>
                  <td className="small text-muted">{exp.payer || user?.name || 'You'}</td>
                  <td className="small text-muted">{exp.date || 'Today'}</td>
                  <td className="fw-bold text-coral">${exp.amount}</td>
                  <td className="text-end">
                    <Button 
                      variant="link" 
                      className="text-danger p-0 ms-2"
                      onClick={() => handleDeleteExpense(exp.id, exp.title)}
                      title="Delete Expense"
                    >
                      <i className="bi bi-trash-fill fs-6"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* Set/Edit Budget Modal */}
      <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            <i className="bi bi-wallet2 text-coral me-2"></i>Set Custom Trip Budget Limit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveBudget}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Budget Limit ($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter budget (e.g. 1500)"
                value={newBudgetLimit}
                onChange={(e) => setNewBudgetLimit(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Define the total amount you want to spend for this trip.
              </Form.Text>
            </Form.Group>

            <div className="text-end mt-4">
              <Button variant="light" className="me-2" onClick={() => setShowBudgetModal(false)}>Cancel</Button>
              <Button variant="coral" type="submit" className="btn-coral fw-bold">Save Budget</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default BudgetTracker;
