
import { useEffect, useRef, useState } from 'react';
import './ThongKe_stat.css'
import { Chart } from "chart.js/auto";
import axios from '../../api/axiosClient';
const Stat = () => {
    const [inforStat, setInforStat] = useState();
    let ordersChartInstance = useRef(null);
    let categoryChartInstance = null;
    let revenueChartInstance = null;
    let selectedLine = null;
    const [stats, setStat] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
    });
    const [statsData, setStatData] = useState();
    const legendItems = [
        { key: 'completed', label: 'Hoàn thành', color: '#2563eb' },
        { key: 'cancelled', label: 'Đã hủy', color: '#dc2626' },
        { key: 'returned', label: 'Chờ xử lý', color: '#f59e0b' }
    ];
    // console.log(ordersChartInstance)
    // API URLs 
    useEffect(() => {
        const apiGetStats = async () => {
            const api = await axios.get('/api/stat/GetStat');
            setInforStat(api);
            setStat({
                totalRevenue: api?.totalRevenue[0]?.total || 0,
                totalOrders: api?.totalOrders[0]?.total || 0,
                totalProducts: api?.totalProducts[0]?.need || 0,
                totalCustomers: api?.totalCustomers[0]?.need || 0
            })

        }

        const apiGetOrderdata = async () => {
            const api = await axios.get('/api/stat/GetOrdersData');
            renderOrdersChart(api);
        }
        const GetOrdersData = async () => {
            const api = await axios.get('/api/stat/GetRevenue');
            renderRevenueChart(api);
        }
        const GetCategoryData = async () => {
            const api = await axios.get('/api/stat/GetCategoryData');
            renderCategoryChart(api);

        }
        const init = async () => {
            await apiGetStats();
            await GetOrdersData();
            await GetCategoryData();
            await apiGetOrderdata();
        }
        init();
    }, [])

    useEffect(() => {
        setStatData([
            { icon: '💰', label: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), growth: stats.revenueGrowth, color: '#2563eb' },
            { icon: '🛒', label: 'Tổng đơn hàng', value: stats.totalOrders.toLocaleString(), growth: stats.ordersGrowth, color: '#7c3aed' },
            { icon: '📦', label: 'Sản phẩm', value: stats.totalProducts.toLocaleString(), growth: 5.2, color: '#059669' },
            { icon: '👥', label: 'Khách hàng', value: stats.totalCustomers.toLocaleString(), growth: 15.7, color: '#f59e0b' }
        ])

    }, [stats])



    // Format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    }

    // Fetch data from API
    async function fetchData() {
        document.getElementById('loadingState').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
        // console.log(document.getElementById('loadingState').style);
        await new Promise(resolve => setTimeout(resolve, 800));
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

    }

    // Render orders chart
    function renderOrdersChart(data) {
        const ctx = document.getElementById('ordersChart').getContext('2d');
        if (ordersChartInstance.current) {
            ordersChartInstance.current.destroy();
        }
        ordersChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month),
                datasets: [
                    {
                        label: 'Hoàn thành',
                        data: data?.map(d => d.completed),
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.05)',
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Đã hủy',
                        data: data?.map(d => d.cancelled),
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.05)',
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#dc2626',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Chờ xử lý',
                        data: data?.map(d => d.returned),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#6b7280',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 12 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            font: { size: 12 }
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });


        const summaryHtml = `
                 <div class="summary-item-stat">
                    <div class="summary-value-stat" style="color: #2563eb;">${data?.reduce((s, d) => s + d.completed, 0)}</div>
                    <div class="summary-label-stat">Tổng hoàn thành</div>
                </div>
                <div class="summary-item-stat">
                    <div class="summary-value-stat" style="color: #dc2626;">${data?.reduce((s, d) => s + d.cancelled, 0)}</div>
                    <div class="summary-label-stat">Tổng hủy</div>
                </div>
                <div class="summary-item-stat">
                    <div class="summary-value-stat" style="color: #f59e0b;">${data?.reduce((s, d) => s + d.returned, 0)}</div>
                    <div class="summary-label-stat">Tổng chờ xử lý</div>
                </div>
            `;
        document.getElementById('ordersSummary').innerHTML = summaryHtml;

    }

    function toggleLine(key) {
        if (selectedLine === key) {
            selectedLine = null;
            ordersChartInstance.current.data.datasets.forEach(ds => ds.hidden = false);
            document.querySelectorAll('.legend-item-stat').forEach(el => {
                el.classList.remove('disabled');
            });
        } else {
            selectedLine = key;
            const keyMap = { 'completed': 0, 'cancelled': 1, 'returned': 2 };
            ordersChartInstance.current.data.datasets.forEach((ds, i) => {
                ds.hidden = i !== keyMap[key];
            });
            document.querySelectorAll('.legend-item-stat').forEach(el => {
                el.classList.toggle('disabled-stat', !el.id.includes(key));
            });
        }
        ordersChartInstance.current.update('none');
    }

    function renderCategoryChart(data) {
        const ctx = document.getElementById('categoryChart').getContext('2d');

        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }

        categoryChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    data: data.map(d => d.value),
                    backgroundColor: data.map(d => d.color),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        const total = data.reduce((s, d) => s + d.value, 0);
        const listHtml = data.map(cat => {
            const percentage = ((cat.value / total) * 100).toFixed(1);
            return `
                    <div class="category-item-stat">
                        <div class="category-header-stat">
                            <div class="category-name-stat">
                                <div class="category-color-stat" style="background: ${cat.color};"></div>
                                <span>${cat.name}</span>
                            </div>
                            <span class="category-count-stat">${cat.value} SP</span>
                        </div>
                        <div class="category-progress-stat">
                            <div class="category-progress-bar-stat" style="width: ${percentage}%; background: ${cat.color};"></div>
                        </div>
                    </div>
                `;
        }).join('');
        document.getElementById('categoryList').innerHTML = listHtml;
    }

    // Render revenue chart
    function renderRevenueChart(data) {
        const ctx = document.getElementById('revenueChart').getContext('2d');

        if (revenueChartInstance) {
            revenueChartInstance.destroy();
        }

        revenueChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.month),
                datasets: [{
                    label: 'Doanh thu',
                    data: data.map(d => d.revenue),
                    backgroundColor: '#2563eb',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => (value / 1000000).toFixed(0) + 'M'
                        }
                    }
                }
            }
        });
        // console.log(data);

        const total = data.reduce((s, d) => + s + Number(d.revenue), 0);
        const avg = total / data.length;
        const max = Math.max(...data.map(d => d.revenue));
        // console.log(total);
        const statsHtml = `
                <div class="revenue-item-stat">
                    <div class="revenue-label-stat">Tổng doanh thu</div>
                    <div class="revenue-value-stat" style="color: #2563eb;">${formatCurrency(total)}</div>
                </div>
                <div class="revenue-item-stat">
                    <div class="revenue-label-stat">Trung bình/tháng</div>
                    <div class="revenue-value-stat" style="color: #059669;">${formatCurrency(avg)}</div>
                </div>
                <div class="revenue-item-stat">
                    <div class="revenue-label-stat">Tháng cao nhất</div>
                    <div class="revenue-value-stat" style="color: #7c3aed;">${formatCurrency(max)}</div>
                </div>
            `;
        document.getElementById('revenueStats').innerHTML = statsHtml;
    }

    // Init
    useEffect(() => {
        fetchData();

    }, [])
    return (
        <>
            <div className="loading-container-stat" id="loadingState">
                <div className="loading-card-stat">
                    <div className="loading-icon-stat"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
            <div id="mainContent" style={{ "display": "none" }}>
                <div className="header-stat">
                    <div className="header-content-stat">
                        <div>
                            <h1 className="title-stat">Thống Kê</h1>
                            <p className="subtitle-stat">Tổng quan hoạt động kinh doanh</p>
                        </div>
                        <button className="btn-refresh-stat" onClick={fetchData}>
                            <span>↻</span>
                            Làm mới
                        </button>
                    </div>
                </div>
                <div className="container-stat">
                    <div className="stats-grid-stat fade-in-stat" id="statsCards">
                        {statsData?.map(stat => {
                            return (
                                <div key={'ide' + stat.label} className="stat-card-stat">
                                    <div className="stat-header-stat">
                                        <div className="stat-icon-stat" style={{ 'background': `${stat.color}15` }}>
                                            {stat.icon}
                                        </div>
                                        <span className="stat-label-stat">{stat.label}</span>
                                    </div>
                                    <div className="stat-value-stat">{stat.value}</div>
                                </div>)
                        }
                        )}
                    </div>
                    <div className="charts-grid-stat">
                        <div className="chart-card-stat fade-in-stat">
                            <div className="chart-header-stat">
                                <h2 className="chart-title-stat">Thống kê đơn hàng 6 tháng gần đây</h2>
                                <p className="chart-subtitle-stat">Theo dõi đơn hàng: Hoàn thành, Hủy, Chờ xử lý</p>
                            </div>
                            <div className="legend-stat" id="orderLegend">
                                {legendItems.map((item) => {
                                    return (
                                        <div className="legend-item-stat" onClick={() => {
                                            toggleLine(item.key)
                                        }} id={`legend-${item.key}`}
                                            key={`legend1-${item.key}`}
                                        >
                                            <div className="legend-color-stat" style={{ "background": `${item.color}` }}></div>
                                            <span>{item.label}</span>
                                        </div>)
                                })}
                            </div>
                            <div className="chart-canvas-wrapper-stat">
                                <canvas id="ordersChart"></canvas>
                            </div>
                            <div className="summary-grid-stat" id="ordersSummary"></div>
                        </div>
                        <div className="chart-card-stat fade-in-stat">
                            <div className="chart-header-stat">
                                <h2 className="chart-title-stat">Phân bổ theo danh mục</h2>
                                <p className="chart-subtitle-stat">Tỷ lệ sản phẩm bán ra theo từng danh mục</p>
                            </div>
                            <div className="chart-canvas-wrapper-stat">
                                <canvas id="categoryChart"></canvas>
                            </div>
                            <div className="category-list-stat" id="categoryList"></div>
                        </div>
                    </div>
                    <div className="chart-card-stat chart-full-stat fade-in-stat">
                        <div className="chart-header-stat">
                            <h2 className="chart-title-stat">Doanh thu 6 tháng gần đây</h2>
                            <p className="chart-subtitle-stat">Theo dõi xu hướng tăng trưởng doanh thu</p>
                        </div>
                        <div className="chart-canvas-wrapper-stat" style={{ "height": "350px" }}>
                            <canvas id="revenueChart"></canvas>
                        </div>
                        <div className="revenue-stats-stat" id="revenueStats"></div>
                    </div>
                </div>
            </div>

        </>)
}
export default Stat;
