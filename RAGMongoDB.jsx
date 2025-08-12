import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Zap } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// This is a placeholder for your actual MongoDB retrieval logic.
// In a real application, you would make an API call to a backend service
// which would then connect to your MongoDB Atlas cluster.
async function fetchRelevantTickets(query) {
  // Simulate an API call delay.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // This is where you would call your backend to perform a vector search
  // on your MongoDB Atlas collection.
  // const response = await fetch('/api/search', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query: query })
  // });
  // const data = await response.json();
  // return data.tickets;

  // --- Placeholder data for demonstration ---
  const allTickets = [
    {
      id: 'TKT-101',
      title: 'Failed login attempts on production',
      description: 'Users are reporting that their login attempts are failing with a generic error message after three consecutive tries. The issue seems to be related to the rate-limiting feature introduced in the last deployment. This is a high-priority bug.',
      keywords: ['login', 'authentication', 'rate-limiting', 'bug', 'production'],
    },
    {
      id: 'TKT-102',
      title: 'Update dashboard UI for better readability',
      description: 'The current dashboard layout is cluttered and difficult to read. We need to update the color scheme, font sizes, and card layouts to improve the user experience. This is a UX improvement task.',
      keywords: ['UI', 'UX', 'dashboard', 'redesign', 'frontend'],
    },
    {
      id: 'TKT-103',
      title: 'Investigate slow database queries',
      description: 'The API endpoint for fetching user data is experiencing significant latency. We suspect some database queries are inefficient and need to be optimized. This task requires a backend developer to profile and refactor the queries.',
      keywords: ['database', 'performance', 'latency', 'backend', 'optimization'],
    },
    {
      id: 'TKT-104',
      title: 'Implement new user signup flow',
      description: 'We need to create a new, more streamlined user registration process. This includes a new form, email verification, and a welcome page. The new flow should be intuitive and guide the user effectively.',
      keywords: ['signup', 'onboarding', 'user flow', 'registration', 'frontend'],
    },
  ];

  // Simple keyword-based match for the demo
  const matchedTickets = allTickets.filter(ticket =>
    ticket.description.toLowerCase().includes(query.toLowerCase()) ||
    ticket.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return matchedTickets;
}

// This is a placeholder for your actual LLM call.
// In a real application, you would send the retrieved documents and
// the user's query to your `ChatOpenAI` model via an API endpoint.
async function summarizeTicketsWithAI(query, tickets) {
  // Simulate an API call delay.
  await new Promise(resolve => setTimeout(resolve, 2000));

  // This is where you would construct the prompt for your LLM chain.
  // The prompt would look something like this:
  // "The user's query is: '{query}'. Based on the following related tickets,
  // provide a summary and answer the user's question.
  // Retrieved Tickets: {JSON.stringify(tickets)}"

  // And then you would make the API call to your backend.
  // const response = await fetch('/api/summarize', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query: query, tickets: tickets })
  // });
  // const data = await response.json();
  // return data.summary;

  // --- Placeholder summary for demonstration ---
  let summary = `Based on your search for "${query}", I found the following relevant tickets:\n\n`;
  if (tickets.length > 0) {
    tickets.forEach(ticket => {
      summary += `- **${ticket.title}** (${ticket.id}): ${ticket.description.slice(0, 80)}...\n`;
    });
    summary += `\nTo get a detailed summary of these tickets, you would send this information to an AI model like gpt-4o-mini with a prompt like: "Summarize the key information from these tickets and answer the user's question: '${query}'".\n`;
  } else {
    summary += "No relevant tickets were found in the database. Please try a different query.";
  }
  
  return summary;
}

// Main App component
const App = () => {
  const [query, setQuery] = useState('');
  const [relevantTickets, setRelevantTickets] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const handleSearch = async () => {
    setIsLoadingSearch(true);
    setRelevantTickets([]);
    setSummary('');
    setIsError(false);

    try {
      const tickets = await fetchRelevantTickets(query);
      setRelevantTickets(tickets);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSummarize = async () => {
    if (relevantTickets.length === 0) {
      setSummary('No tickets were retrieved to summarize. Please perform a search first.');
      return;
    }

    setIsLoadingSummary(true);
    setSummary('');
    setIsError(false);
    
    try {
      const aiSummary = await summarizeTicketsWithAI(query, relevantTickets);
      setSummary(aiSummary);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-['Inter']">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl text-white">
            <CardTitle className="text-3xl font-bold">Vector Search & AI Summary</CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              Search for tickets using natural language and get an AI-powered summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Textarea
              className="w-full text-lg p-4 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your query about a ticket or a business problem, e.g., 'What's the status of the login bug?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
            />
            <div className="flex gap-4">
              <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                disabled={isLoadingSearch || !query}
              >
                {isLoadingSearch ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Find Relevant Tickets (Simulated DB)
              </Button>
              <Button
                onClick={handleSummarize}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                disabled={isLoadingSummary || relevantTickets.length === 0}
              >
                {isLoadingSummary ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Generate AI Summary (Simulated LLM)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            {isError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred. Please check the console and try again.
                </AlertDescription>
              </Alert>
            )}
            {relevantTickets.length > 0 && (
              <Card className="w-full rounded-xl border-blue-400 border-2 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-xl">Retrieved Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relevantTickets.map(ticket => (
                    <div key={ticket.id} className="p-4 border border-blue-200 rounded-lg bg-white shadow-sm">
                      <h3 className="font-bold text-blue-800">{ticket.title}</h3>
                      <p className="text-gray-700 mt-1">{ticket.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Keywords: {ticket.keywords.join(', ')}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {summary && (
              <Card className="w-full mt-6 rounded-xl border-purple-400 border-2 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-xl">AI Summary</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-line text-gray-800">
                  {summary}
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default App;
