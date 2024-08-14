ALTER TABLE lesson
    MODIFY COLUMN graph_x TEXT,
    MODIFY COLUMN graph_y TEXT;

ALTER TABLE lesson_record_graph
    MODIFY COLUMN graph_x TEXT,
    MODIFY COLUMN graph_y TEXT;
