import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackbarAlert from "../components/SnackbarAlert";
import { getMe } from "../service/user-service";
import { logout } from "../service/auth-service";
import { getIncomeTotalByPeriod, getRecentIncomes } from "../service/income-service";
import { getExpenseByPeriod, getRecentExpenses } from "../service/expense-service";
import { formatDateToYYYYMMDD, getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from "../utils/date";

type User = {
    id: string;
    name: string;
    email: string;
};

type Movement = {
    id: string;
    title: string;
    amount: number;
    createdAt: string;
};

type Totals = {
    incomes: number;
    expenses: number;
};

function formatCurrencyBRL(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Dashboard() {
    const navigate = useNavigate();

    // user
    const [me, setMe] = useState<User | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    // totals
    const [totals, setTotals] = useState<Totals>({ incomes: 0, expenses: 0 });
    const [loadingTotals, setLoadingTotals] = useState(true);

    // lists
    const [recentIncomes, setRecentIncomes] = useState<Movement[]>([]);
    const [recentExpenses, setRecentExpenses] = useState<Movement[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);

    // snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("info");

    const balance = useMemo(
        () => totals.incomes - totals.expenses,
        [totals.incomes, totals.expenses]
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchAll() {
        try {
            setLoadingMe(true);
            setLoadingTotals(true);
            setLoadingLists(true);

            const meData = await getMe();
            setMe(meData);

            const startDate = getFirstDayOfCurrentMonth();
            const endDate = getLastDayOfCurrentMonth();

            const startDateStr = formatDateToYYYYMMDD(startDate);
            const endDateStr = formatDateToYYYYMMDD(endDate);

            const page = 1;
            const limit = 5;

            const [
                sumIncome,
                sumExpense,
                incList,
                expList
            ] = await Promise.all([
                getIncomeTotalByPeriod(startDateStr, endDateStr),
                getExpenseByPeriod(startDateStr, endDateStr),
                getRecentIncomes(page, limit),
                getRecentExpenses(page, limit),
            ]);

            setTotals({
                incomes: sumIncome.total ?? 0,
                expenses: sumExpense.total ?? 0,
            });

            setRecentIncomes(
                incList.map((i) => ({
                    id: i.id,
                    title: i.description || "Receita",
                    amount: Number(i.amount),
                    createdAt: i.createdAt,
                }))
            );

            setRecentExpenses(
                expList.map((e) => ({
                    id: e.id,
                    title: e.description || e.category?.name || "Despesa",
                    amount: Number(e.amount),
                    createdAt: e.createdAt,
                }))
            );
        } catch (err: any) {
            console.error(err);
            setSnackbarMessage("Não foi possível carregar o dashboard.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoadingMe(false);
            setLoadingTotals(false);
            setLoadingLists(false);
        }
    }

    function HeaderSkeleton() {
        return (
            <Stack spacing={1}>
                <Skeleton variant="text" width={220} />
                <Skeleton variant="text" width={160} />
            </Stack>
        );
    }

    function TotalsSkeleton() {
        return (
            <Grid container spacing={2}>
                {[1, 2, 3].map((k) => (
                    <Grid item xs={12} md={4} key={k}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="rounded" height={20} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Box p={3}>
            <Box mb={3}>
                {loadingMe ? (
                    <HeaderSkeleton />
                ) : (
                    <>
                        <Typography variant="h5">
                            Olá, {me?.name?.split(" ")[0] || "usuário"} 👋
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Aqui está um resumo das suas finanças.
                        </Typography>

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        >
                            Sair
                        </Button>
                    </>
                )}
            </Box>

            {loadingTotals ? (
                <TotalsSkeleton />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Receitas
                                </Typography>
                                <Typography variant="h5" fontWeight={700} mt={1}>
                                    {formatCurrencyBRL(totals.incomes)}
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => navigate("/incomes/new")}
                                    >
                                        Adicionar Receita
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Despesas
                                </Typography>
                                <Typography variant="h5" fontWeight={700} mt={1}>
                                    {formatCurrencyBRL(totals.expenses)}
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => navigate("/expenses/new")}
                                    >
                                        Adicionar Despesa
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Saldo
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    mt={1}
                                    color={balance >= 0 ? "success.main" : "error.main"}
                                >
                                    {formatCurrencyBRL(balance)}
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate("/reports")}
                                    >
                                        Ver Relatórios
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6">Últimas receitas</Typography>
                                <Button size="small" onClick={() => navigate("/incomes")}>
                                    Ver todas
                                </Button>
                            </Stack>
                            <Divider />
                            <List dense>
                                {loadingLists
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <ListItem key={i}>
                                            <ListItemText
                                                primary={<Skeleton width="40%" />}
                                                secondary={<Skeleton width="20%" />}
                                            />
                                            <Skeleton width="25%" />
                                        </ListItem>
                                    ))
                                    : recentIncomes.map((inc) => (
                                        <ListItem
                                            key={inc.id}
                                            secondaryAction={
                                                <Typography fontWeight={600}>
                                                    {formatCurrencyBRL(inc.amount)}
                                                </Typography>
                                            }
                                        >
                                            <ListItemText
                                                primary={inc.title}
                                                secondary={new Date(inc.createdAt).toLocaleDateString("pt-BR")}
                                            />
                                        </ListItem>
                                    ))}
                                {!loadingLists && recentIncomes.length === 0 && (
                                    <Box py={2}>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Nenhuma receita cadastrada.
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6">Últimas despesas</Typography>
                                <Button size="small" onClick={() => navigate("/expenses")}>
                                    Ver todas
                                </Button>
                            </Stack>
                            <Divider />
                            <List dense>
                                {loadingLists
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <ListItem key={i}>
                                            <ListItemText
                                                primary={<Skeleton width="40%" />}
                                                secondary={<Skeleton width="20%" />}
                                            />
                                            <Skeleton width="25%" />
                                        </ListItem>
                                    ))
                                    : recentExpenses.map((exp) => (
                                        <ListItem
                                            key={exp.id}
                                            secondaryAction={
                                                <Typography fontWeight={600} color="error.main">
                                                    {formatCurrencyBRL(exp.amount)}
                                                </Typography>
                                            }
                                        >
                                            <ListItemText
                                                primary={exp.title}
                                                secondary={new Date(exp.createdAt).toLocaleDateString("pt-BR")}
                                            />
                                        </ListItem>
                                    ))}
                                {!loadingLists && recentExpenses.length === 0 && (
                                    <Box py={2}>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Nenhuma despesa cadastrada.
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
        </Box>
    );
}
