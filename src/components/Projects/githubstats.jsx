import React, { useEffect, useState } from 'react';
import ProjectList from './projectlist';
import './projects.css';

const GitHubStats = ({ username }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchStats();
    }, [username]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="github-stats">
                <h2>GitHub Stats for {username}</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Followers</th>
                            <td>{stats.followers}</td>
                        </tr>
                        <tr>
                            <th>Following</th>
                            <td>{stats.following}</td>
                        </tr>
                        <tr>
                            <th>Public Repos</th>
                            <td>{stats.public_repos}</td>
                        </tr>
                        <tr>
                            <th>Public Gists</th>
                            <td>{stats.public_gists}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ProjectList />
        </div>
    );
};

export default GitHubStats;