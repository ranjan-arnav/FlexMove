-- Row-Level Security Policies for FlexMove

-- Enable RLS on all tables
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disruptions ENABLE ROW LEVEL SECURITY;

-- Shipments Policies
-- Users can view shipments they're involved in
CREATE POLICY "Users view own shipments"
ON shipments FOR SELECT
USING (
  auth.uid()::text = supplier_id OR
  auth.uid()::text = transporter_id OR
  auth.uid()::text = customer_id
);

-- Only suppliers can create shipments
CREATE POLICY "Suppliers create shipments"
ON shipments FOR INSERT
WITH CHECK (auth.uid()::text = supplier_id);

-- Only suppliers can update their shipments
CREATE POLICY "Suppliers update own shipments"
ON shipments FOR UPDATE
USING (auth.uid()::text = supplier_id);

-- Only suppliers can delete their shipments
CREATE POLICY "Suppliers delete own shipments"
ON shipments FOR DELETE
USING (auth.uid()::text = supplier_id);

-- Users Policies
-- Users can view their own profile
CREATE POLICY "Users view own profile"
ON users FOR SELECT
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id);

-- Notifications Policies
-- Users can view their own notifications
CREATE POLICY "Users view own notifications"
ON notifications FOR SELECT
USING (auth.uid()::text = user_id);

-- System can create notifications
CREATE POLICY "System creates notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
USING (auth.uid()::text = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users delete own notifications"
ON notifications FOR DELETE
USING (auth.uid()::text = user_id);

-- Disruptions Policies
-- Everyone can view disruptions
CREATE POLICY "Everyone views disruptions"
ON disruptions FOR SELECT
USING (true);

-- Only authenticated users can create disruptions
CREATE POLICY "Authenticated users create disruptions"
ON disruptions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update disruptions they created
CREATE POLICY "Users update own disruptions"
ON disruptions FOR UPDATE
USING (auth.uid()::text = created_by);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shipments_supplier ON shipments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_transporter ON shipments(transporter_id);
CREATE INDEX IF NOT EXISTS idx_shipments_customer ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_disruptions_severity ON disruptions(severity);
