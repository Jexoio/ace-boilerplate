import casual from 'casual';

export default {
  User: () => ({ updatedAt: () => casual.unix_time }),
  JiraIssue: () => ({
    id: () => Math.ceil(casual.random * 100),
  }),
};
