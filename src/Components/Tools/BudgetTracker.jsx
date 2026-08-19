import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

function BudgetTracker() {
  const { activeTrip, addExpense } = useTrip();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('You (Alex)');
  const [category, setCategory] = useState('Food');

  const totalSpent = activeTrip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const budgetLimit = activeTrip.budgetLimit || 2500;
  const percentUsed = Math.min(Math.round((totalSpent / budgetLimit) * 100), 100);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (title && amount) {
      addExpense({
        title,
        amount: Number(amount),
        payer,
        category,
        date: new Date().toISOString().split('T')[0]
      });
      showToast('Expense Recorded!', `Added $${amount} for "${title}" under ${category}.`, 'success', 'bi-cash-coin');
      setTitle('');
      setAmount('');
    }
  };

  const members = ['You (Alex)', 'Sarah M.', 'David K.'];
  const perPersonShare = Math.round(totalSpent / members.length);

  const paidMap = {};
  members.forEach(m => paidMap[m] = 0);
  activeTrip.expenses.forEach(e => {
    paidMap[e.payer] = (paidMap[e.payer] || 0) + e.amount;
  });

  return (
    <Card className="card-trippoo shadow-sm border-0 rounded-4 overflow-hidden mb-4 text-start">
      <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">
          <i className="bi bi-calculator-fill text-coral me-2"></i>Budget Tracker & Expense Splitter
        </h5>
        <Badge bg="coral" className="btn-coral px-3 py-2 fs-6">${totalSpent} / ${budgetLimit}</Badge>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Budget Progress */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small fw-bold">Budget Utilization ({percentUsed}%)</span>
            <span className={`small fw-bold ${totalSpent > budgetLimit ? 'text-danger' : 'text-coral'}`}>
              {totalSpent > budgetLimit ? 'Over Budget!' : `$${budgetLimit - totalSpent} Remaining`}
            </span>
          </div>
          <ProgressBar 
            now={percentUsed} 
            variant={percentUsed > 90 ? 'danger' : 'danger'} 
            style={{ height: '10px' }} 
          />
        </div>

        <div className="row g-4">
          {/* Add Expense Form */}
          <div className="col-md-5">
            <div className="bg-light p-3 rounded-4 border">
              <h6 className="fw-bold text-dark mb-3">Add New Expense</h6>
              <Form onSubmit={handleAddExpense}>
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-bold">Expense Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Group Dinner at Trastevere" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <Form.Label className="small fw-bold">Amount ($)</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="e.g. 120" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-6">
                    <Form.Label className="small fw-bold">Category</Form.Label>
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Food">Food & Drinks</option>
                      <option value="Lodging">Lodging</option>
                      <option value="Transport">Transport</option>
                      <option value="Activities">Activities</option>
                    </Form.Select>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Paid By</Form.Label>
                  <Form.Select value={payer} onChange={(e) => setPayer(e.target.value)}>
                    {members.map(m => <option key={m} value={m}>{m}</option>)}
                  </Form.Select>
                </Form.Group>

                <Button variant="coral" type="submit" className="btn-coral w-100 fw-bold">
                  + Record Expense
                </Button>
              </Form>
            </div>
          </div>

          {/* Group Expense Settlement Calculator */}
          <div className="col-md-7">
            <h6 className="fw-bold text-dark mb-2">Group Expense Settlement ("Who Owes Whom")</h6>
            <p className="small text-muted mb-3">
              Equal share: <strong>${perPersonShare}</strong> per person ({members.length} travelers).
            </p>

            <ul className="list-group mb-3 border rounded-4">
              {members.map(m => {
                const paid = paidMap[m] || 0;
                const diff = paid - perPersonShare;
                return (
                  <li key={m} className="list-group-item d-flex justify-content-between align-items-center py-2.5">
                    <div>
                      <strong className="d-block text-dark">{m}</strong>
                      <small className="text-muted">Paid total: ${paid}</small>
                    </div>
                    <div>
                      {diff > 0 ? (
                        <Badge bg="success">+ Receives ${diff}</Badge>
                      ) : diff < 0 ? (
                        <Badge bg="danger">Owes ${Math.abs(diff)}</Badge>
                      ) : (
                        <Badge bg="secondary">Settled Up</Badge>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Expenses History Table */}
            <h6 className="fw-bold text-dark mb-2">Recent Expense Log</h6>
            <div className="max-h-160 overflow-auto border rounded-4 bg-white">
              <table className="table table-sm mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Payer</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {activeTrip.expenses.map(e => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td>{e.title}</td>
                      <td>{e.payer}</td>
                      <td className="fw-bold text-coral">${e.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BudgetTracker;
