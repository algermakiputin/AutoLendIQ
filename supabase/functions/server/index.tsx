import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as db from "./database.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-aa912fb4/health", (c) => {
  return c.json({ status: "ok" });
});

// NOTE: Database tables must be created manually in Supabase dashboard
// See /supabase/SETUP_INSTRUCTIONS.md for setup instructions

// ==================== LOAN APPLICATION ENDPOINTS ====================

// Create a new loan application
app.post("/make-server-aa912fb4/applications", async (c) => {
  try {
    const body = await c.req.json();
    const application = await db.createLoanApplication(body);
    
    // Add initial status history
    await db.addStatusHistory(application.id, 'pending', 'Application submitted');
    
    return c.json({ success: true, data: application }, 201);
  } catch (error) {
    console.error('Error creating loan application:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create loan application',
      details: error.message 
    }, 500);
  }
});

// Get all loan applications
app.get("/make-server-aa912fb4/applications", async (c) => {
  try {
    const applications = await db.getAllLoanApplications();
    return c.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch loan applications',
      details: error.message 
    }, 500);
  }
});

// Get a single loan application by ID
app.get("/make-server-aa912fb4/applications/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const application = await db.getLoanApplication(id);
    return c.json({ success: true, data: application });
  } catch (error) {
    console.error('Error fetching loan application:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch loan application',
      details: error.message 
    }, 404);
  }
});

// Update a loan application
app.put("/make-server-aa912fb4/applications/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const application = await db.updateLoanApplication(id, body);
    
    // Add status history if status changed
    if (body.status) {
      await db.addStatusHistory(id, body.status, body.status_notes);
    }
    
    return c.json({ success: true, data: application });
  } catch (error) {
    console.error('Error updating loan application:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update loan application',
      details: error.message 
    }, 500);
  }
});

// ==================== AI ASSESSMENT ENDPOINTS ====================

// Create AI assessment for an application
app.post("/make-server-aa912fb4/assessments", async (c) => {
  try {
    const body = await c.req.json();
    const assessment = await db.createAIAssessment(body);
    
    // Update the application with AI scores
    await db.updateLoanApplication(body.application_id, {
      ai_score: body.overall_score,
      ai_recommendation: body.recommendation,
      ai_confidence: body.confidence,
      status: 'under_review',
    });
    
    await db.addStatusHistory(body.application_id, 'under_review', 'AI assessment completed');
    
    return c.json({ success: true, data: assessment }, 201);
  } catch (error) {
    console.error('Error creating AI assessment:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create AI assessment',
      details: error.message 
    }, 500);
  }
});

// Get AI assessment for an application
app.get("/make-server-aa912fb4/assessments/:applicationId", async (c) => {
  try {
    const applicationId = c.req.param('applicationId');
    const assessment = await db.getAIAssessment(applicationId);
    return c.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error fetching AI assessment:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch AI assessment',
      details: error.message 
    }, 404);
  }
});

// ==================== APPROVER ACTION ENDPOINTS ====================

// Create an approver action (approve/reject)
app.post("/make-server-aa912fb4/approver-actions", async (c) => {
  try {
    const body = await c.req.json();
    const action = await db.createApproverAction(body);
    
    // Update application status
    const newStatus = body.action === 'approved' ? 'approved' : 'rejected';
    await db.updateLoanApplication(body.application_id, {
      status: newStatus,
    });
    
    await db.addStatusHistory(
      body.application_id, 
      newStatus, 
      `Application ${newStatus} by ${body.approver_name}: ${body.justification}`
    );
    
    return c.json({ success: true, data: action }, 201);
  } catch (error) {
    console.error('Error creating approver action:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create approver action',
      details: error.message 
    }, 500);
  }
});

// Get approver actions for an application
app.get("/make-server-aa912fb4/approver-actions/:applicationId", async (c) => {
  try {
    const applicationId = c.req.param('applicationId');
    const actions = await db.getApproverActions(applicationId);
    return c.json({ success: true, data: actions });
  } catch (error) {
    console.error('Error fetching approver actions:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch approver actions',
      details: error.message 
    }, 500);
  }
});

// ==================== STATUS HISTORY ENDPOINTS ====================

// Get status history for an application
app.get("/make-server-aa912fb4/status-history/:applicationId", async (c) => {
  try {
    const applicationId = c.req.param('applicationId');
    const history = await db.getStatusHistory(applicationId);
    return c.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching status history:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch status history',
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);